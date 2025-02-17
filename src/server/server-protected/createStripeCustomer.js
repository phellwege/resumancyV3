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
    return res.status(500).json({
      error: "Internal Server Error: Unable to fetch secrets",
    });
  }
});

// Stripe Customer Creation Route
router.post("/", async (req, res) => {
  try {
    console.log("🔍 Received request body:", req.body);

    const stripeInstance = stripe(req.secrets.STRIPE_KEY);
    const { email, firebaseUID } = req.body;

    if (!email || !firebaseUID) {
      console.warn("⚠️ Missing required fields:", { email, firebaseUID });
      return res.status(400).json({ error: "Missing email or Firebase UID" });
    }

    console.log(`🚀 Creating Stripe customer for email: ${email}`);

    // Create Stripe customer
    const customer = await stripeInstance.customers.create({
      email,
      metadata: { firebaseUID },
    });

    console.log("🎉 Stripe Customer Created:", customer.id);

    return res.status(200).json({ stripeCustomerId: customer.id });
  } catch (error) {
    console.error("❌ Error creating Stripe customer:", error);
    return res.status(500).json({
      error: `Failed to create Stripe customer: ${error.message}`,
    });
  }
});

// Health check route
router.get("/", (req, res) => {
  res.send("Resumancy Cloud Run API is live!");
});

// Export the router so it can be mounted in your main server file
module.exports = router;
