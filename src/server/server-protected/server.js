const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

require("dotenv").config();
admin.initializeApp();

const app = express();

const corsOptions = {
    origin: ["http://localhost:3000", "https://resumancy.com"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
});

app.use(cors(corsOptions));
app.use(bodyParser.json());

async function getSecret(secretName) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/resumancy/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
}

app.use(async (req, res, next) => {
    // Handle OPTIONS requests immediately
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    
    try {
        // Retrieve secrets first (for your API keys, etc.)
        req.secrets = {
            GPT_API_KEY: await getSecret("GPT_API_KEY"),
            STRIPE_KEY: await getSecret("STRIPE_KEY"),
        };

        // Allow unauthenticated access to the root if desired
        if (req.path === "/") return next();

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("Missing or malformed Authorization header:", req.headers.authorization);
            return res.status(401).json({
                error: "Unauthorized",
                details: "Missing or malformed Authorization header"
            });
        }

        const idToken = authHeader.split("Bearer ")[1];
        try {
            // Attempt to verify the token
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(403).json({
                error: "Invalid or expired token",
                details: error.message
            });
        }
    } catch (error) {
        console.error("Error retrieving secrets:", error);
        return res.status(500).json({
            error: "Internal Server Error: Unable to fetch secrets",
            details: error.message
        });
    }
});

app.get("/", (req, res) => res.send("🔒 Protected API Server is live!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🔒 Protected API Server running on port ${PORT}`));
