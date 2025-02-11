const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe");

const db = admin.firestore();

exports.handle_stripe_webhook = functions
    .runWith({
        secrets: ["STRIPE_KEY", "STRIPE_WEBHOOK_SECRET"],
    })
    .https.onRequest(async (req, res) => {
        try {
            const stripeInstance = stripe(functions.secrets.STRIPE_KEY);
            const stripeWebhookSecret = functions.secrets.STRIPE_WEBHOOK_SECRET;

            const sig = req.headers["stripe-signature"];
            const event = stripeInstance.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);

            if (event.type === "customer.subscription.created") {
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
    });

async function handleSubscriptionUpdate(subscription) {
    try {
        const customerId = subscription.customer;
        const planId = subscription.items.data[0].plan.id;
        const status = subscription.status;
        const billingCycleStart = subscription.current_period_start * 1000;
        const dateActivated = subscription.start_date * 1000;

        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("stripeCustomerId", "==", customerId).get();

        if (snapshot.empty) {
            console.warn("⚠️ No user found for Stripe customer:", customerId);
            return;
        }

        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({
            "subscription.plan": planId,
            "subscription.active": status === "active",
            "subscription.billingCycleStart": billingCycleStart,
            "subscription.dateActivated": dateActivated,
        });

        console.log(`✅ Subscription updated for user ${userDoc.id} (Plan: ${planId}, Status: ${status})`);
    } catch (error) {
        console.error("❌ Error updating subscription in Firestore:", error);
    }
}

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
            "subscription.plan": "basic",
            "subscription.active": false,
            "subscription.billingCycleStart": null,
            "subscription.dateActivated": null,
        });

        console.log(`⚠️ Subscription canceled for user ${userDoc.id}, reverted to "basic" plan.`);
    } catch (error) {
        console.error("❌ Error canceling subscription:", error);
    }
}

async function handleCheckoutSessionCompleted(session) {
    try {
        const customerId = session.customer;
        const planId = session.subscription;

        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("stripeCustomerId", "==", customerId).get();

        if (snapshot.empty) {
            console.warn("⚠️ No user found for Stripe customer:", customerId);
            return;
        }

        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({
            "subscription.plan": planId,
            "subscription.active": true,
            "subscription.billingCycleStart": new Date().getTime(),
            "subscription.dateActivated": new Date().getTime(),
        });

        console.log(`✅ Checkout completed: Subscription activated for user ${userDoc.id}`);
    } catch (error) {
        console.error("❌ Error processing checkout session:", error);
    }
}
