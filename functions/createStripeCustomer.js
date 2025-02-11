const { onRequest } = require("firebase-functions/v2/https");

const stripe = require("stripe");


exports.createStripeCustomer = onRequest(
    { secrets: ["STRIPE_KEY"] }, 
    async (req, res) => {
        try {
            const stripeInstance = stripe(process.env.STRIPE_KEY);

            const { email, firebaseUID } = req.body;
            if (!email || !firebaseUID) {
                return res.status(400).json({ error: "Missing email or Firebase UID" });
            }

            const customer = await stripeInstance.customers.create({
                email,
                metadata: { firebaseUID },
            });

            return res.status(200).json({ stripeCustomerId: customer.id });
        } catch (error) {
            console.error("❌ Error creating Stripe customer:", error);
            return res.status(500).json({ error: "Failed to create Stripe customer" });
        }
    }
);
