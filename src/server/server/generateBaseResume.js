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

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware to attach secrets
app.use(async (req, res, next) => {
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

// Base Resume Generation Route
app.post("/generate-base-resume", async (req, res) => {
    try {
        const apiKey = req.secrets.GPT_API_KEY;
        const { user } = req.body;
        const openai = new OpenAI({ apiKey });

        const summarizeResumeWithRetry = async (retryCount = 0) => {
            try {
                const gptResponse = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Craft a professional resume summary in roughly 3 sentences." },
                        { role: "user", content: `Experience: ${user.resume[0].experience.map(e => `${e.expJobTitle} at ${e.expCompanyName}, ${e.expTime}`).join("; ")}\nEducation: ${user.resume[0].education}\nSkills: ${user.resume[0].skills}` }
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
            summary: { type: "base", data: summary },
        });
    } catch (error) {
        res.status(500).json({ error: "Error generating resume: " + error.message });
    }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
