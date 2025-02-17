const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

require("dotenv").config();
admin.initializeApp();

const app = express();

// ✅ Define CORS Options
const corsOptions = {
    origin: ["http://localhost:3000", "https://resumancy.com"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

// ✅ 1. Handle CORS Preflight Requests FIRST
app.options("*", cors(corsOptions));

// ✅ 2. Apply CORS to ALL requests
app.use(cors(corsOptions));

// ✅ 3. Parse JSON body
app.use(bodyParser.json());

// ✅ 4. Function to Fetch Secrets
async function getSecret(secretName) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/resumancy/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
}

// ✅ 5. Authentication Middleware (AFTER CORS & OPTIONS Handling)
app.use(async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // ✅ Properly respond to preflight requests
    }

    try {
        req.secrets = {
            GPT_API_KEY: await getSecret("GPT_API_KEY"),
            STRIPE_KEY: await getSecret("STRIPE_KEY"),
        };

        if (req.path === "/") return next(); // ✅ Skip authentication for health check

        // ✅ Enforce Authentication on ALL Routes (Including `/limited-function`)
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

// ✅ 6. Secure `/limited-function` (Authentication Required)
app.post("/limited-function", (req, res) => {
    res.json({ message: "🔐 Secure function executed successfully.", user: req.user });
});

// ✅ 7. Health Check Route (Always Open)
app.get("/", (req, res) => res.send("🔒 Protected API Server is live!"));

// ✅ 8. Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🔒 Protected API Server running on port ${PORT}`));
