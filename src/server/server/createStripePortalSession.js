const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const stripe = require("stripe");
require("dotenv").config(); // For local development

// Initialize Firebase Admin SDK
admin.initializeApp();

// Function to fetch secrets from Google Cloud Secret Manager
async function getSecret(secretName) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/resumancy/secrets/${secretName}/versions/latest`, // ✅ Uses dynamic secretName
    });
    return version.payload.data.toString();
}

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware to attach secrets
app.use(async (req, res, next) => {
    try {
        req.secrets = {
            STRIPE_KEY: await getSecret("STRIPE_KEY"), // ✅ Uses correct function call
        };
        next();
    } catch (error) {
        console.error("Error retrieving secrets:", error);
        return res.status(500).json({ error: "Internal Server Error: Unable to fetch secrets" });
    }
});

// Stripe Portal Session Route
app.post("/create-stripe-portal-session", async (req, res) => {
    try {
        const stripeInstance = stripe(req.secrets.STRIPE_KEY);
        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ error: "Stripe customer ID is required" });
        }

        const session = await stripeInstance.billingPortal.sessions.create({
            customer: customerId,
            return_url: "https://resumancy.com",
        });

        return res.json({ url: session.url });
    } catch (error) {
        console.error("❌ Error creating Stripe portal session:", error);
        return res.status(500).json({ error: error.message });
    }
});

// Health check route
app.get("/", (req, res) => {
    res.send("Resumancy Cloud Run API is live!");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
