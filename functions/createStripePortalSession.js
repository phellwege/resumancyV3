const { onRequest } = require("firebase-functions/v2/https");
const stripe = require("stripe");
const admin = require("firebase-admin");

// Securely access Stripe secret key from Firebase Secret Manager
exports.createStripePortalSession = onRequest(
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
            await admin.auth().verifyIdToken(authHeader.split('Bearer ')[1]);
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized: ' + error.message });
        }

        try {
            const stripeInstance = stripe(process.env.STRIPE_KEY);
            const { customerId } = req.body;

            if (!customerId) {
                return res.status(400).json({ error: "Stripe customer ID is required" });
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
    }
);
