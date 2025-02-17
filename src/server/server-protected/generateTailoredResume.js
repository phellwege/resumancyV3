const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const OpenAI = require("openai");
require("dotenv").config(); // For local development

// Function to fetch secrets from Google Cloud Secret Manager
async function getSecret(secretName) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/resumancy/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
}

// Create an Express router instead of an app
const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

// Middleware to attach secrets
router.use(async (req, res, next) => {
    try {
        req.secrets = {
            GPT_API_KEY: await getSecret("GPT_API_KEY"),
        };
        next();
    } catch (error) {
        console.error("Error retrieving secrets:", error);
        return res.status(500).json({ error: "Internal Server Error: Unable to fetch secrets" });
    }
});

// Tailored Resume Generation Route
router.post("/", async (req, res) => {
    try {
        const apiKey = req.secrets.GPT_API_KEY;
        const { user, selectedTailoredResumeIdData } = req.body;

        if (!user || !selectedTailoredResumeIdData) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const openai = new OpenAI({ apiKey });

        const summarizeResumeWithRetry = async (retryCount = 0) => {
            try {
                const gptResponse = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Craft a concise and professional resume summary (around three sentences) that highlights the candidate’s skills, experience, and qualifications in a way that aligns with the provided job description. DO NOT mention any company names in the response." },
                        { role: "user", content: `Job Description: ${selectedTailoredResumeIdData.description}\nUser Resume Data: ${JSON.stringify(user.resume[0])}` }
                    ],
                    temperature: 0.4,
                    max_tokens: 1000,
                });
                return gptResponse.choices[0].message.content;
            } catch (error) {
                if (retryCount < 3) return summarizeResumeWithRetry(retryCount + 1);
                throw new Error("Error summarizing resume after 3 attempts");
            }
        };

        const [summary] = await Promise.all([
            summarizeResumeWithRetry().catch(e => `Error: ${e.message}`),
        ]);

        res.status(200).json({
            summary: { type: "tailored", data: summary },
        });
    } catch (error) {
        res.status(500).json({ error: "Error generating tailored resume: " + error.message });
    }
});

// Export the router so it can be mounted in your main server file
module.exports = router;
