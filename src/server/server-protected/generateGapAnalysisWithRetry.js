const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const OpenAI = require("openai");
require("dotenv").config(); // For local development

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

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

// Apply CORS and body parsing middleware if needed (or assume main app already does this)
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

// Function to handle gap analysis generation with retries
async function generateGapAnalysisWithRetry(selectedTailoredResumeIdData, user, resumeText, missingSkills, apiKey, retryCount = 0) {
  const openai = new OpenAI({ apiKey });
  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a professional career advisor. 
            Please identify the top 3 most impactful skill gaps, providing specific, actionable recommendations and steps for each gap.
            Please prioritize the skill gaps by impact, discussing the top 3 first in detail, then briefly mention any additional minor gaps if needed.
            Include specific suggestions such as online courses or resources where applicable, in order of most impactful for the applicant displayed first.
            Do not include "###", or any similar decoration in your final response; just use plain text, bullet points, or headings.
            Please keep your entire response under 800 words, concluding your analysis completely if you approach the limit.
          `
        },
        {
          role: "user",
          content: `
            Job Description: ${selectedTailoredResumeIdData.description}
            Resume Text: ${resumeText}
            Missing Skills: ${missingSkills.join(", ")}
            
            Please provide a detailed gap analysis with recommendations.
          `
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return gptResponse.choices[0].message.content;
  } catch (error) {
    if (retryCount < 3) {
      return generateGapAnalysisWithRetry(selectedTailoredResumeIdData, user, resumeText, missingSkills, apiKey, retryCount + 1);
    } else {
      throw new Error("Error generating gap analysis after 3 attempts");
    }
  }
}

// Gap Analysis Generation Route
// This route is now relative to the mount point (e.g., if mounted at /generate-gap-analysis, a POST to "/" here means POST /generate-gap-analysis)
router.post("/", async (req, res) => {
  try {
    const apiKey = req.secrets.GPT_API_KEY;
    const { user, selectedTailoredResumeIdData, resumeText, missingSkills } = req.body;
    if (!user || !selectedTailoredResumeIdData || !resumeText || !missingSkills) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    try {
      const gapAnalysisText = await generateGapAnalysisWithRetry(
        selectedTailoredResumeIdData,
        user,
        resumeText,
        missingSkills,
        apiKey
      );

      await db.collection("gapAnalyses").doc(selectedTailoredResumeIdData.id).set({
        resumeId: selectedTailoredResumeIdData.id,
        userId: user.id,
        jobDescription: selectedTailoredResumeIdData.description,
        missingSkills: missingSkills,
        gapAnalysis: gapAnalysisText,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({ gapAnalysis: gapAnalysisText });
    } catch (error) {
      return res.status(500).json({ error: "Error generating gap analysis: " + error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error processing request: " + error.message });
  }
});

// Export the router so it can be mounted in your main server file
module.exports = router;
