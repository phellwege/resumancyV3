const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

require("dotenv").config();
admin.initializeApp();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Function to fetch secrets from Google Cloud Secret Manager
async function getSecret(secretName) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/YOUR_PROJECT_ID/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
}

// Middleware: Fetch secrets & Require Authentication
app.use(async (req, res, next) => {
    try {
        req.secrets = {
            GPT_API_KEY: await getSecret("GPT_API_KEY"),
            STRIPE_KEY: await getSecret("STRIPE_KEY"),
        };

        if (req.path === "/") return next(); // Skip authentication for health check

        // Authentication Middleware (Protects all routes except "/")
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const idToken = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
    } catch (error) {
        console.error("❌ Error retrieving secrets:", error);
        return res.status(500).json({ error: "Internal Server Error: Unable to fetch secrets" });
    }
});

// Protected Routes
const generateCoverLetter = require("./generateCoverLetter");
const generateTailoredResume = require("./generateTailoredResume");
const generateBaseResume = require("./generateBaseResume");
const createStripeCustomer = require("./createStripeCustomer");
const createStripePortalSession = require("./createStripePortalSession");
const deleteUserAccount = require("./deleteUserAccount");
const generateGapAnalysisWithRetry = require("./generateGapAnalysisWithRetry");
const limitedFunction = require("./limitedFunction");

app.post("/generate-cover-letter", generateCoverLetter);
app.post("/generate-tailored-resume", generateTailoredResume);
app.post("/generate-base-resume", generateBaseResume);
app.post("/create-stripe-customer", createStripeCustomer);
app.post("/create-stripe-portal-session", createStripePortalSession);
app.post("/delete-user-account", deleteUserAccount);
app.post("/generate-gap-analysis", generateGapAnalysisWithRetry);
app.post("/limited-function", limitedFunction);

// Health check (Does not require authentication)
app.get("/", (req, res) => res.send("🔒 Protected API Server is live!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🔒 Protected API Server running on port ${PORT}`));
