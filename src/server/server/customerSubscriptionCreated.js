const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const stripe = require("stripe");
require("dotenv").config(); // For local development

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Function to fetch secrets from Google Cloud Secret Manager
async function getSecret(secretName) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/resumancy/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
}

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

// Middleware to attach secrets
app.use(async (req, res, next) => {
    try {
        req.secrets = {
            STRIPE_KEY: await getSecret("STRIPE_KEY"),
            STRIPE_WEBHOOK_SECRET: await getSecret("STRIPE_WEBHOOK_SECRET"),
        };
        next();
    } catch (error) {
        console.error("Error retrieving secrets:", error);
        return res.status(500).json({ error: "Internal Server Error: Unable to fetch secrets" });
    }
});

// Stripe Webhook Handler
app.post("/handle-stripe-webhook", async (req, res) => {
    try {
        const stripeInstance = stripe(req.secrets.STRIPE_KEY);
        const stripeWebhookSecret = req.secrets.STRIPE_WEBHOOK_SECRET;
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
});

// ✅ Handle Subscription Updates
async function handleSubscriptionUpdate(subscription) {
    try {
        const customerId = subscription.customer;
        const planId = subscription.items.data[0].plan.id;
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
        const isNewCycle = userData.subscription.billingCycleStart !== billingCycleStart;

        // Build the update payload
        const updatedData = {
            "subscription.plan": planId,
            "subscription.active": status === "active" || status === "trialing",
            "subscription.billingCycleStart": billingCycleStart,
            "subscription.dateActivated": dateActivated,
            "subscription.currentPeriodEndDate": currentPeriodEndDate,
            "subscription.limits": limits,
        };

        if (isNewCycle) {
            updatedData["subscription.usage.tailoredResumes"] = 0;
        }

        await userDoc.ref.update(updatedData);

        console.log(`✅ Subscription updated for user ${userDoc.id} (Plan: ${planId}, Status: ${status})`);
    } catch (error) {
        console.error("❌ Error updating subscription in Firestore:", error);
    }
}

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));