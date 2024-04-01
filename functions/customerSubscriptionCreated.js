const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = functions.config().stripe.key;
admin.initializeApp();

exports.handle_stripe_webhook = functions.https.onRequest(async (req, res) => {
    try {
        const stripeWebhookSecret = functions.config().stripe_web_hook_secrect.key; 
        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);

        if (event.type === 'customer.subscription.created') {
        const subscription = event.data.object;

        const subscriptionTierRef = admin.firestore().collection('SubscriptionTiers').doc('prod_OcUb0kQtIhwYKl');
        const subscriptionTierSnapshot = await subscriptionTierRef.get();

        if (!subscriptionTierSnapshot.exists) {
            throw new Error('Subscription tier not found in Firestore');
        }

        const subscriptionTierData = subscriptionTierSnapshot.data();

        await admin.firestore().collection('customers').doc(subscription.customer).update({
            active: subscriptionTierData.active,
            description: subscriptionTierData.description,
            images: subscriptionTierData.images,
            metadata: subscriptionTierData.metadata,
            firebaseRole: subscriptionTierData.firebaseRole,
            name: subscriptionTierData.name,
            role: subscriptionTierData.role,
            tax_code: subscriptionTierData.tax_code,
        });
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error handling webhook event.' });
    }
});

