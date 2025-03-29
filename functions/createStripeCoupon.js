const { onRequest } = require("firebase-functions/v2/https");
const stripe = require("stripe");

/**
 * Creates a single-use Stripe coupon for a referral code
 * This function creates a 20% discount coupon in Stripe that can be used only once
 */
exports.createStripeCoupon = onRequest(
    { cors: true, secrets: ["STRIPE_KEY"] },
    async (req, res) => {
        try {
            console.log("🔍 Received request to create Stripe coupon:", req.body);

            const stripeKey = process.env.STRIPE_KEY;
            if (!stripeKey) {
                console.error("❌ STRIPE_KEY is missing from environment variables!");
                return res.status(500).json({ error: "Internal Server Error: STRIPE_KEY missing" });
            }

            console.log("✅ Stripe key found, initializing Stripe instance...");
            const stripeInstance = stripe(stripeKey);

            const { referralCode, userId } = req.body;
            if (!referralCode || !userId) {
                console.warn("⚠️ Missing required fields:", { referralCode, userId });
                return res.status(400).json({ error: "Missing referral code or user ID" });
            }

            console.log(`🚀 Creating Stripe coupon for referral code: ${referralCode}`);

            // Create the coupon in Stripe
            const coupon = await stripeInstance.coupons.create({
                name: `Referral: ${referralCode}`,
                percent_off: 20,
                duration: 'once',
                max_redemptions: 1, // Single-use coupon
                metadata: {
                    type: 'referral',
                    referrerId: userId
                }
            });

            console.log("🎉 Stripe Coupon Created:", coupon.id);

            return res.status(200).json({ 
                couponId: coupon.id,
                percentOff: coupon.percent_off,
                message: "Coupon created successfully"
            });
        } catch (error) {
            console.error("❌ Error creating Stripe coupon:", error);
            return res.status(500).json({ error: `Failed to create Stripe coupon: ${error.message}` });
        }
    }
);
