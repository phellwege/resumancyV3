// limitedRoutes.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Assuming that admin.initializeApp() is already called in your main server file,
// do not call it here again.

const db = admin.firestore();

const RATE_LIMIT = 5; // Max 5 requests
const TIME_WINDOW = 15000; // 15 seconds

// Rate limiting middleware for limited routes
router.use(async (req, res, next) => {
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

// Example protected route
router.post("/", async (req, res) => {
  res.json({ message: "Request allowed." });
});

module.exports = router;
