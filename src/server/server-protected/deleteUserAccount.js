const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const stripe = require("stripe");
require("dotenv").config(); // For local development

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Function to fetch secrets from Google Cloud Secret Manager
async function getSecret(secretName) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/resumancy/secrets/${secretName}/versions/latest`,
  });
  return version.payload.data.toString();
}

// Create an Express router instead of an app
const router = express.Router();

// Apply CORS and body parsing middleware
router.use(cors());
router.use(bodyParser.json());

// Middleware to attach secrets
router.use(async (req, res, next) => {
  try {
    req.secrets = {
      STRIPE_KEY: await getSecret("STRIPE_KEY"),
    };
    next();
  } catch (error) {
    console.error("Error retrieving secrets:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error: Unable to fetch secrets" });
  }
});

// Delete User Account Route
// This route is relative to the mount point. For example, if you mount it at "/delete-account",
// a POST here means POST /delete-account.
router.post("/", async (req, res) => {
  try {
    const stripeInstance = stripe(req.secrets.STRIPE_KEY);
    const { userId, stripeCustomerId } = req.body;
    
    if (!userId || !stripeCustomerId) {
      return res
        .status(400)
        .json({ error: "Missing userId or stripeCustomerId" });
    }

    const subscriptions = await stripeInstance.subscriptions.list({
      customer: stripeCustomerId,
      status: "all",
    });

    for (const sub of subscriptions.data) {
      if (sub.status === "active" || sub.status === "trialing") {
        await stripeInstance.subscriptions.cancel(sub.id);
      }
    }

    // Optionally, delete the customer on Stripe
    // await stripeInstance.customers.del(stripeCustomerId);

    // Delete user document from Firestore
    await db.collection("users").doc(userId).delete();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting account:", error);
    res.status(500).json({ error: error.message });
  }
});

// Export the router so it can be mounted in your main server file
module.exports = router;
