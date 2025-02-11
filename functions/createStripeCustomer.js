const { onRequest } = require("firebase-functions/v2/https");
const stripe = require("stripe");

exports.createStripeCustomer = onRequest(
    { cors: true, secrets: ["STRIPE_KEY"] },
    async (req, res) => {
        try {
            console.log("🔍 Received request body:", req.body);

            const stripeKey = process.env.STRIPE_KEY;
            if (!stripeKey) {
                console.error("❌ STRIPE_KEY is missing from environment variables!");
                return res.status(500).json({ error: "Internal Server Error: STRIPE_KEY missing" });
            }

            console.log("✅ Stripe key found, initializing Stripe instance...");
            const stripeInstance = stripe(stripeKey);

            const { email, firebaseUID } = req.body;
            if (!email || !firebaseUID) {
                console.warn("⚠️ Missing required fields:", { email, firebaseUID });
                return res.status(400).json({ error: "Missing email or Firebase UID" });
            }

            console.log(`🚀 Creating Stripe customer for email: ${email}`);

            // 🔥 Create Stripe customer
            const customer = await stripeInstance.customers.create({
                email,
                metadata: { firebaseUID },
            });

            console.log("🎉 Stripe Customer Created:", customer.id);

            return res.status(200).json({ stripeCustomerId: customer.id });
        } catch (error) {
            console.error("❌ Error creating Stripe customer:", error);
            return res.status(500).json({ error: `Failed to create Stripe customer: ${error.message}` });
        }
    }
);
