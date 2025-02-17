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

// Function to handle cover letter generation with retries
async function generateCoverLetterWithRetry(selectedTailoredResumeIdData, user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });

    try {
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
                        You are a professional assistant tasked with writing concise, compelling cover letters. 
                        The response must be polite, professional, and error-free, and tailored to the user's resume and job description. 
                        Use placeholders for unknown information like "Dear Hiring Manager" and omit specific addresses if unavailable.
                    `
                },
                {
                    role: "user",
                    content: `
                        Write a cover letter for the following job description: ${selectedTailoredResumeIdData.description}.
                        Here's a brief summary from their current resume for reference: ${user.resume[0].summary}.
                        Additional information:
                        First Name: ${user.firstName},
                        Last Name: ${user.lastName},
                        Company: ${selectedTailoredResumeIdData.companyName}.
                        Assume the recipient's name and company address are not provided.
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
            return generateCoverLetterWithRetry(selectedTailoredResumeIdData, user, apiKey, retryCount + 1);
        } else {
            throw new Error("Error generating cover letter after 3 attempts");
        }
    }
}

// Cover Letter Generation Route
app.post("/generate-cover-letter", async (req, res) => {
    try {
        const apiKey = req.secrets.GPT_API_KEY;
        const { user, selectedTailoredResumeIdData } = req.body;

        try {
            const coverLetterSummary = await generateCoverLetterWithRetry(selectedTailoredResumeIdData, user, apiKey);
            res.status(200).json({ coverLetterSummary });
        } catch (error) {
            res.status(500).json({ error: "Error generating cover letter: " + error.message });
        }
    } catch (error) {
        res.status(500).json({ error: "Error processing request: " + error.message });
    }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
