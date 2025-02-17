const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

const RATE_LIMIT = 5; // Max 5 requests
const TIME_WINDOW = 15000; // 15 seconds

exports.limitedFunction = onRequest(
    { cors: true },
    async (req, res) => {
        if (req.method === "OPTIONS") {
            return res.status(204).send("");
        }

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

            return res.json({ message: "Request allowed." });
        } catch (error) {
            console.error("❌ Rate limit error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
);
