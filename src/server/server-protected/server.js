const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

require("dotenv").config();
admin.initializeApp();

const app = express();

// ✅ Fix: Configure CORS to allow localhost during development
app.use(cors({
    origin: ["http://localhost:3000", "https://resumancy.com"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

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

        // ✅ Fix: Allow public routes (e.g., Stripe Webhook, Rate Limiter)
        const publicRoutes = ["/limited-function", "/handle-stripe-webhook"];
        if (publicRoutes.includes(req.path)) return next();

        // Authentication Middleware (Protects all other routes)
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

// ✅ Fix: Ensure `limited-function` route is publicly accessible
app.post("/limited-function", (req, res) => {
    res.json({ message: "Limited function executed successfully." });
});

// Health check route (Always open)
app.get("/", (req, res) => res.send("🔒 Protected API Server is live!"));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🔒 Protected API Server running on port ${PORT}`));
