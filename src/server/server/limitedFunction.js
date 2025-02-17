const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
require("dotenv").config(); // For local development

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

const RATE_LIMIT = 5; // Max 5 requests
const TIME_WINDOW = 15000; // 15 seconds

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
    try {
        const userId = req.user ? req.user.uid : req.ip;
        const docRef = db.collection("rateLimits").doc(userId);
        const now = Date.now();

        const doc = await docRef.get();
        if (doc.exists) {
            const { lastRequests } = doc.data() || { lastRequests: [] };

            const recentRequests = lastRequests.filter(ts => now - ts < TIME_WINDOW);

            if (recentRequests.length >= RATE_LIMIT) {
                return res.status(429).json({ message: "Too many requests. Please wait a moment before trying again." });
            }

            recentRequests.push(now);
            await docRef.update({ lastRequests: recentRequests });
        } else {
            await docRef.set({ lastRequests: [now] });
        }

        next();
    } catch (error) {
        console.error("❌ Rate limit error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Example Protected Route
app.post("/protected-route", async (req, res) => {
    return res.json({ message: "Request allowed." });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
