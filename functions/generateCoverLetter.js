const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const OpenAI = require('openai');


async function getSecret(secretName) {
    const [version] = await client.accessSecretVersion({
        name: `projects/Resumancy/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString('utf8');
}

async function generateCoverLetterWithRetry(user, retryCount = 0) {
    const apiKey = await getSecret('GPT_API_KEY');
    const openai = new OpenAI({ apiKey });
    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `
                        Limit this response to a single paragraph.
                    `
                },
                {
                    role: 'user',
                    content: `
                        Write a cover letter for the following job description: ${user.tailoredResume.description}. Here's a brief summary from their current resume for reference: ${user.resume.summary}.
                    `
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "{}",
        });
        return gptResponse.choices[0].message.content;
    } catch (error) {
        if (retryCount < 3) {
            return generateCoverLetterWithRetry(user, retryCount + 1);
        } else {
            throw new Error('Error generating cover letter after 3 attempts');
        }
    }
}

exports.generate_cover_letter = functions.https.onRequest(async (request, response) => {
    if (request.method === 'OPTIONS') {
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
        response.set('Access-Control-Allow-Headers', 'Content-Type');
        response.status(204).send('');
        return;
    }
    cors(request, response, async () => {
        try {
            const { user } = request.body;
            const coverLetterSummary = await generateCoverLetterWithRetry(user);
            response.set('Access-Control-Allow-Origin', '*');
            response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
            response.set('Access-Control-Allow-Headers', 'Content-Type');
            response.status(200).json({ coverLetterSummary });
        } catch (error) {
            response.status(500).send('Error generating cover letter: ' + error.message);
        }
    });
});
