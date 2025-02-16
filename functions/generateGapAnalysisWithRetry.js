const { onRequest } = require("firebase-functions/v2/https");
const OpenAI = require('openai');
const admin = require('firebase-admin');

// Function to handle gap analysis generation with retries
async function generateGapAnalysisWithRetry(selectedTailoredResumeIdData, user, resumeText, missingSkills, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });
    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `
                        You are a professional career advisor. 
                        Please identify the top 3 most impactful skill gaps, providing specific, actionable recommendations and steps for each gap.
                        Please prioritize the skill gaps by impact, discussing the top 3 first in detail, then briefly mention any additional minor gaps if needed.
                        Include specific suggestions such as online courses or resources where applicable, in order of most impactful for the applicant displayed first.
                        Do not include "###", '**', or any similar decoration in your final response; just use plain text, bullet points, or headings.
                        Please keep your entire response under 800 words, concluding your analysis completely if you approach the limit.
                    `
                },
                {
                    role: 'user',
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
            throw new Error('Error generating gap analysis after 3 attempts');
        }
    }
}

exports.generate_gap_analysis = onRequest(
    { cors: true, memory: "512Mi", secrets: ["GPT_API_KEY"] },
    async (req, res) => {
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }
        try {
            const apiKey = process.env.GPT_API_KEY;
            // Expect the client to send these parameters in the POST body
            const { user, selectedTailoredResumeIdData, resumeText, missingSkills } = req.body;
            if (!user || !selectedTailoredResumeIdData || !resumeText || !missingSkills) {
                res.status(400).json({ error: "Missing required parameters." });
                return;
            }

            try {
                const gapAnalysisText = await generateGapAnalysisWithRetry(
                    selectedTailoredResumeIdData,
                    user,
                    resumeText,
                    missingSkills,
                    apiKey
                );

                // Store the gap analysis in Firestore under a "gapAnalyses" collection,
                // using the same resumeId for easy retrieval.
                await admin.firestore().collection("gapAnalyses").doc(selectedTailoredResumeIdData.id).set({
                    resumeId: selectedTailoredResumeIdData.id,
                    userId: user.id,
                    jobDescription: selectedTailoredResumeIdData.description,
                    missingSkills: missingSkills,
                    gapAnalysis: gapAnalysisText,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                res.status(200).json({ gapAnalysis: gapAnalysisText });
            } catch (error) {
                res.status(500).json({ error: 'Error generating gap analysis: ' + error.message });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error processing request: ' + error.message });
        }
    }
);
