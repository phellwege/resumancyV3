const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe'); // No need to initialize stripe at this point
admin.initializeApp();

// Secret Manager function to retrieve secrets
async function getSecret(secretName) {
    const [version] = await client.accessSecretVersion({
        name: `projects/Resumancy/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString('utf8');
}

exports.handle_stripe_webhook = functions.https.onRequest(async (req, res) => {
    try {
        // Retrieve the Stripe secret key from Google Secret Manager
        const stripeKey = await getSecret('STRIPE_KEY');
        const stripeInstance = stripe(stripeKey);  // Initialize Stripe with the key from secret manager

        // Retrieve the webhook secret key from Firebase config (environment variable)
        const stripeWebhookSecret = functions.config().stripe_web_hook_secrect.key;
        const sig = req.headers['stripe-signature'];

        // Construct and verify the Stripe webhook event
        const event = stripeInstance.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);

        if (event.type === 'customer.subscription.created') {
            const subscription = event.data.object;

            const subscriptionTierRef = admin.firestore().collection('SubscriptionTiers').doc('prod_OcUb0kQtIhwYKl');
            const subscriptionTierSnapshot = await subscriptionTierRef.get();

            if (!subscriptionTierSnapshot.exists) {
                throw new Error('Subscription tier not found in Firestore');
            }

            const subscriptionTierData = subscriptionTierSnapshot.data();

            // Update Firestore with subscription details
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
