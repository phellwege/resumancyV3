const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const stripe = require("stripe");

const db = admin.firestore();

exports.handle_stripe_webhook = onRequest(
    { cors: true, invoker: "public", secrets: ["STRIPE_KEY", "STRIPE_WEBHOOK_SECRET"] }, 
    async (req, res) => {
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        try {
            const stripeInstance = stripe(process.env.STRIPE_KEY);
            const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            const sig = req.headers["stripe-signature"];
            const event = stripeInstance.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);

            if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
                await handleSubscriptionUpdate(event.data.object);
            } else if (event.type === "customer.subscription.deleted") {
                await handleSubscriptionCancel(event.data.object);
            } else if (event.type === "checkout.session.completed") {
                await handleCheckoutSessionCompleted(event.data.object);
            }

            res.status(200).json({ received: true });
        } catch (error) {
            console.error("❌ Error handling webhook:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// ✅ Handle Subscription Updates
async function handleSubscriptionUpdate(subscription) {
    try {
        const customerId = subscription.customer;
        const planId = subscription.items?.data?.[0]?.plan?.id;
        if (!planId) {
            console.error("❌ No plan ID found in subscription event");
            return;
        }
        const status = subscription.status;
        const billingCycleStart = subscription.current_period_start * 1000;
        const dateActivated = subscription.start_date * 1000;
        const currentPeriodEndDate = subscription.current_period_end * 1000;
        
        const subscriptionPlans = {
            price_1QrL8vEsYMRYIVaAx4EV21RU: { baseResume: 1, tailoredResumes: 5 },
            price_1QrL8vEsYMRYIVaAnoVKXDwS: { baseResume: 1, tailoredResumes: 5 },
            price_1QrL8rEsYMRYIVaAR2eJ9Vta: { baseResume: 1, tailoredResumes: Infinity },
            price_1QrL8rEsYMRYIVaABNH1JBGo: { baseResume: 1, tailoredResumes: Infinity },
        };
        const limits = subscriptionPlans[planId] || { baseResume: 0, tailoredResumes: 0 };

        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("stripeCustomerId", "==", customerId).get();

        if (snapshot.empty) {
            console.warn("⚠️ No user found for Stripe customer:", customerId);
            return;
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Determine if a new billing cycle has begun
        const isNewCycle = userData.subscription?.billingCycleStart !== billingCycleStart;

        // Build the update payload
        const updatedData = {
            "subscription.plan": planId,
            "subscription.active": status === "active" || status === "trialing",
            "subscription.billingCycleStart": billingCycleStart,
            "subscription.dateActivated": dateActivated,
            "subscription.currentPeriodEndDate": currentPeriodEndDate,
            "subscription.limits": limits,
        };

        // Only reset tailored resume usage if a new cycle has begun.
        // Base resume usage remains static.
        if (isNewCycle) {
            updatedData["subscription.usage.tailoredResumes"] = 0;
        }

        await userDoc.ref.update(updatedData);

        console.log(`✅ Subscription updated for user ${userDoc.id} (Plan: ${planId}, Status: ${status})`);
    } catch (error) {
        console.error("❌ Error updating subscription in Firestore:", error);
    }
}


// ✅ Handle Subscription Cancellations
async function handleSubscriptionCancel(subscription) {
    try {
        const customerId = subscription.customer;

        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("stripeCustomerId", "==", customerId).get();

        if (snapshot.empty) {
            console.warn("⚠️ No user found for Stripe customer:", customerId);
            return;
        }

        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({
            "subscription.plan": "cancelled",
            "subscription.active": false,
            "subscription.billingCycleStart": null,
            "subscription.dateActivated": null,
        });

        console.log(`⚠️ Subscription canceled for user ${userDoc.id}, marked as "cancelled".`);
    } catch (error) {
        console.error("❌ Error canceling subscription:", error);
    }
}

// ✅ Handle Checkout Session Completion
async function handleCheckoutSessionCompleted(session) {
    try {
        const customerId = session.customer;
        const userId = session.client_reference_id;
        const planId = session.subscription;

        console.log(`✅ Checkout completed: Updating user ${userId} with Stripe customer ${customerId}`);

        const userRef = db.collection("users").doc(userId);
        await userRef.update({
            "stripeCustomerId": customerId,
            "subscription.plan": planId,
            "subscription.active": true,
            "subscription.billingCycleStart": new Date().getTime(),
            "subscription.dateActivated": new Date().getTime(),
        });

        console.log(`✅ Subscription activated for user ${userId} with plan ${planId}`);
    } catch (error) {
        console.error("❌ Error processing checkout session:", error);
    }
}