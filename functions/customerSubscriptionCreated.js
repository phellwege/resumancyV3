const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe'); // No need to initialize stripe at this point
admin.initializeApp();

// Secret Manager function to retrieve secrets
async function getSecret(secretName) {
    const [version] = await client.accessSecretVersion({
        name: `projects/Resumancy/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString('utf8');
}

exports.handle_stripe_webhook = functions.https.onRequest(async (req, res) => {
    try {
        // Retrieve the Stripe secret key from Google Secret Manager
        const stripeKey = await getSecret('STRIPE_KEY');
        const stripeInstance = stripe(stripeKey);  // Initialize Stripe with the key from secret manager

        // Retrieve the webhook secret key from Firebase config (environment variable)
        const stripeWebhookSecret = functions.config().stripe_web_hook_secrect.key;
        const sig = req.headers['stripe-signature'];

        // Construct and verify the Stripe webhook event
        const event = stripeInstance.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);

        if (event.type === 'customer.subscription.created') {
            const subscription = event.data.object;

            const subscriptionTierRef = admin.firestore().collection('SubscriptionTiers').doc('prod_OcUb0kQtIhwYKl');
            const subscriptionTierSnapshot = await subscriptionTierRef.get();

            if (!subscriptionTierSnapshot.exists) {
                throw new Error('Subscription tier not found in Firestore');
            }

            const subscriptionTierData = subscriptionTierSnapshot.data();

            // Update Firestore with subscription details
            await admin.firestore().collection('customers').doc(subscription.customer).update({
                active: subscriptionTierData.active,
                description: subscriptionTierData.description,
                images: subscriptionTierData.images,
                metadata: subscriptionTierData.metadata,
                firebaseRole: subscriptionTierData.firebaseRole,
                name: subscriptionTierData.name,
                role: subscriptionTierData.role,
                tax_code: subscriptionTierData.tax_code,
            });
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error handling webhook event.' });
    }
});


// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
// const stripeLib = require("stripe");

// admin.initializeApp();
// const db = admin.firestore();
// const secretClient = new SecretManagerServiceClient();

// let stripe;

// // **Fetch Stripe Secret at Startup**
// async function initializeStripe() {
//     try {
//         const [version] = await secretClient.accessSecretVersion({
//             name: `projects/Resumancy/secrets/STRIPE_SECRET_KEY/versions/latest`,
//         });
//         stripe = stripeLib(version.payload.data.toString("utf8"));
//         console.log("✅ Stripe initialized.");
//     } catch (error) {
//         console.error("❌ Error initializing Stripe:", error);
//     }
// }
// initializeStripe();

// // **🔥 Webhook Handler**
// exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
//     let event;
//     try {
//         const [version] = await secretClient.accessSecretVersion({
//             name: `projects/Resumancy/secrets/STRIPE_WEBHOOK_SECRET/versions/latest`,
//         });

//         const stripeWebhookSecret = version.payload.data.toString("utf8");
//         const sig = req.headers["stripe-signature"];

//         event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);
//     } catch (error) {
//         console.error("❌ Webhook verification failed:", error.message);
//         return res.status(400).send(`Webhook Error: ${error.message}`);
//     }

//     try {
//         const eventType = event.type;
//         const data = event.data.object;

//         if (eventType === "customer.subscription.created" || eventType === "customer.subscription.updated") {
//             await handleSubscriptionUpdate(data);
//         } else if (eventType === "customer.subscription.deleted") {
//             await handleSubscriptionCancel(data);
//         } else if (eventType === "checkout.session.completed") {
//             await handleCheckoutSessionCompleted(data);
//         }

//         res.status(200).json({ received: true });
//     } catch (error) {
//         console.error("❌ Error processing webhook:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // **🔥 Update Subscription in Firestore**
// async function handleSubscriptionUpdate(subscription) {
//     try {
//         const customerId = subscription.customer;
//         const planId = subscription.items.data[0].plan.id;
//         const status = subscription.status;
//         const billingCycleStart = subscription.current_period_start * 1000; // Convert Unix timestamp
//         const dateActivated = subscription.start_date * 1000; // Convert Unix timestamp

//         // 🔹 **Find the user by Stripe Customer ID**
//         const usersRef = db.collection("users");
//         const snapshot = await usersRef.where("stripeCustomerId", "==", customerId).get();

//         if (snapshot.empty) {
//             console.warn("⚠️ No user found for Stripe customer:", customerId);
//             return;
//         }

//         const userDoc = snapshot.docs[0];
//         await userDoc.ref.update({
//             "subscription.plan": planId, // Store Stripe plan ID
//             "subscription.active": status === "active",
//             "subscription.billingCycleStart": billingCycleStart,
//             "subscription.dateActivated": dateActivated,
//         });

//         console.log(`✅ Subscription updated for user ${userDoc.id} (Plan: ${planId}, Status: ${status})`);
//     } catch (error) {
//         console.error("❌ Error updating subscription in Firestore:", error);
//     }
// }

// // **🔥 Handle Subscription Cancellations**
// async function handleSubscriptionCancel(subscription) {
//     try {
//         const customerId = subscription.customer;

//         // 🔹 **Find the user by Stripe Customer ID**
//         const usersRef = db.collection("users");
//         const snapshot = await usersRef.where("stripeCustomerId", "==", customerId).get();

//         if (snapshot.empty) {
//             console.warn("⚠️ No user found for Stripe customer:", customerId);
//             return;
//         }

//         const userDoc = snapshot.docs[0];
//         await userDoc.ref.update({
//             "subscription.plan": "basic",
//             "subscription.active": false,
//             "subscription.billingCycleStart": null,
//             "subscription.dateActivated": null,
//         });

//         console.log(`⚠️ Subscription canceled for user ${userDoc.id}, reverted to "basic" plan.`);
//     } catch (error) {
//         console.error("❌ Error canceling subscription:", error);
//     }
// }

// // **🔥 Handle Checkout Session Completed (For New Signups)**
// async function handleCheckoutSessionCompleted(session) {
//     try {
//         const customerId = session.customer;
//         const planId = session.subscription;

//         // 🔹 **Find the user by Stripe Customer ID**
//         const usersRef = db.collection("users");
//         const snapshot = await usersRef.where("stripeCustomerId", "==", customerId).get();

//         if (snapshot.empty) {
//             console.warn("⚠️ No user found for Stripe customer:", customerId);
//             return;
//         }

//         const userDoc = snapshot.docs[0];
//         await userDoc.ref.update({
//             "subscription.plan": planId,
//             "subscription.active": true,
//             "subscription.billingCycleStart": new Date().getTime(),
//             "subscription.dateActivated": new Date().getTime(),
//         });

//         console.log(`✅ Checkout completed: Subscription activated for user ${userDoc.id}`);
//     } catch (error) {
//         console.error("❌ Error processing checkout session:", error);
//     }
// }
