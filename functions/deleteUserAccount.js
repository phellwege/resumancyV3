const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const stripe = require("stripe");

const db = admin.firestore();

exports.deleteUserAccount = onRequest(
  { cors: true, secrets: ["STRIPE_KEY"] },
  async (req, res) => {
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    try {
      const stripeInstance = stripe(process.env.STRIPE_KEY);
      const { userId, stripeCustomerId } = req.body;
      
      if (!userId || !stripeCustomerId) {
        return res.status(400).json({ error: "Missing userId or stripeCustomerId" });
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

      // Optionally, delete the customer on Stripe (be cautious as this might affect past records)
      // await stripeInstance.customers.del(stripeCustomerId);

      // Delete user document from Firestore
      await db.collection("users").doc(userId).delete();

      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting account:", error);
      res.status(500).json({ error: error.message });
    }
  }
);
