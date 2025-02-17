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

// Function to fetch secrets from Google Cloud Secret Manager
async function getSecret(secretName) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/resumancy/secrets/${secretName}/versions/latest`,
  });
  return version.payload.data.toString();
}

// Create an Express router
const router = express.Router();

// Apply CORS and body parsing middleware to the router
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

// Stripe Portal Session Route
// This route is relative to its mount point, e.g. if mounted at "/stripe-portal"
// then a POST here will be POST /stripe-portal
router.post("/", async (req, res) => {
  try {
    const stripeInstance = stripe(req.secrets.STRIPE_KEY);
    const { customerId } = req.body;

    if (!customerId) {
      return res
        .status(400)
        .json({ error: "Stripe customer ID is required" });
    }

    const session = await stripeInstance.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://resumancy.com",
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creating Stripe portal session:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Health check route
router.get("/", (req, res) => {
  res.send("Resumancy Cloud Run API is live!");
});

// Export the router so it can be mounted in your main server file
module.exports = router;
