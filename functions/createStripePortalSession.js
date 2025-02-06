const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

// Initialize Stripe with your secret key
const stripe = new Stripe("sk_test_yourSecretKey"); // Replace with your actual Secret Key

exports.createStripePortalSession = functions.https.onRequest(async (req, res) => {
    try {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            return res.status(204).send("");
        }

        const { customerId } = req.body; // Get Stripe Customer ID from frontend

        if (!customerId) {
            return res.status(400).json({ error: "Stripe customer ID is required" });
        }

        // Create a Stripe billing portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: "https://yourwebsite.com/account", // Redirect back to your site
        });

        return res.json({ url: session.url }); // Send URL to frontend
    } catch (error) {
        console.error("Error creating Stripe portal session:", error);
        return res.status(500).json({ error: error.message });
    }
});
