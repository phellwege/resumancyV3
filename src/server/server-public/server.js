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
        name: `projects/resumancy/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
}

// Start the server after fetching secrets
async function startServer() {
    try {
        const STRIPE_KEY = await getSecret("STRIPE_KEY");
        const STRIPE_WEBHOOK_SECRET = await getSecret("STRIPE_WEBHOOK_SECRET");

        app.use((req, res, next) => {
            req.secrets = { STRIPE_KEY, STRIPE_WEBHOOK_SECRET };
            next();
        });

        // Public Route (No Authentication Required)
        app.post("/handle-stripe-webhook", customerSubscriptionCreated);

        app.get("/", (req, res) => res.send("✅ Public Webhook Server is live!"));

        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`🔓 Public Webhook Server running on port ${PORT}`));

    } catch (error) {
        console.error("❌ Failed to fetch secrets:", error);
        process.exit(1); // Stop the server if secrets cannot be retrieved
    }
}

// Run the server
startServer();
