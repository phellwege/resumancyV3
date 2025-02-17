const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
require("dotenv").config(); // For local development

// Initialize Firebase Admin SDK
admin.initializeApp();

// Function to fetch secrets from Google Cloud Secret Manager
async function getSecret(secretName) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/YOUR_PROJECT_ID/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
}

// Import existing function logic
const generateCoverLetter = require("./generateCoverLetter");
const customerSubscriptionCreated = require("./customerSubscriptionCreated");
const generateTailoredResume = require("./generateTailoredResume");
const generateBaseResume = require("./generateBaseResume");
const createStripeCustomer = require("./createStripeCustomer");
const createStripePortalSession = require("./createStripePortalSession");
const deleteUserAccount = require("./deleteUserAccount");
const generateGapAnalysisWithRetry = require("./generateGapAnalysisWithRetry");
const limitedFunction = require("./limitedFunction");

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware to attach secrets
app.use(async (req, res, next) => {
    try {
        req.secrets = {
            STRIPE_KEY: await getSecret("STRIPE_KEY"),
        };
        next();
    } catch (error) {
        console.error("Error retrieving secrets:", error);
        return res.status(500).json({ error: "Internal Server Error: Unable to fetch secrets" });
    }
});

// Define API endpoints
app.post("/generate-cover-letter", generateCoverLetter);
app.post("/handle-stripe-webhook", customerSubscriptionCreated);
app.post("/generate-tailored-resume", generateTailoredResume);
app.post("/generate-base-resume", generateBaseResume);
app.post("/create-stripe-customer", createStripeCustomer);
app.post("/create-stripe-portal-session", createStripePortalSession);
app.post("/delete-user-account", deleteUserAccount);
app.post("/generate-gap-analysis", generateGapAnalysisWithRetry);
app.post("/limited-function", limitedFunction);

// Health check route
app.get("/", (req, res) => {
    res.send("Resumancy Cloud Run API is live!");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
