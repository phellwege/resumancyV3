const express = require("express");
const bodyParser = require("body-parser");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const customerSubscriptionCreated = require("./customerSubscriptionCreated");

const app = express();
app.use(bodyParser.json());

// Function to fetch secrets from Google Cloud Secret Manager
async function getSecret(secretName) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/YOUR_PROJECT_ID/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
}

// Middleware to attach Stripe secrets
app.use(async (req, res, next) => {
    try {
        req.secrets = {
            STRIPE_KEY: await getSecret("STRIPE_KEY"),
            STRIPE_WEBHOOK_SECRET: await getSecret("STRIPE_WEBHOOK_SECRET"),
        };
        next();
    } catch (error) {
        console.error("❌ Error retrieving secrets:", error);
        return res.status(500).json({ error: "Internal Server Error: Unable to fetch secrets" });
    }
});

// Public Route (No Authentication Required)
app.post("/handle-stripe-webhook", customerSubscriptionCreated);

app.get("/", (req, res) => res.send("✅ Public Webhook Server is live!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🔓 Public Webhook Server running on port ${PORT}`));
