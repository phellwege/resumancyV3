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

    // Verify Firebase auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    try {
      const decodedToken = await admin.auth().verifyIdToken(authHeader.split('Bearer ')[1]);
      // Ensure the requesting user matches the account being deleted
      const { userId, stripeCustomerId } = req.body;
      if (decodedToken.uid !== userId) {
        return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: ' + error.message });
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
