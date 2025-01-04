// Import required modules
const { onRequest } = require("firebase-functions/v2/https");
const OpenAI = require('openai');

// Function to handle summarization API call with retries
async function summarizeResumeWithRetry(user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Craft a professional resume summary for this resume in roughly 3 sentences.' },
                { role: 'user', content: `
                    Experience: ${user.resume.experience}
                    Education and Certifications: ${user.resume.education}
                    Skills: ${user.resume.skills}
                ` },
            ],
            temperature: 0.4,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return gptResponse.choices[0].message.content;
    } catch (error) {
        if (retryCount < 3) {
            return summarizeResumeWithRetry(user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error summarizing resume after 3 attempts');
        }
    }
}

// Function to handle experience section API call with retries
async function generateExperienceSectionWithRetry(user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Craft a compelling experience section for the resume that highlights the candidate\'s professional achievements and contributions. (Don\'t include a section name or anything like that, just the content in a format typically seen in a professional resume experience section).' },
                { role: 'user', content: `
                    Experience: ${user.resume.experience}
                    Education and Certifications: ${user.resume.education}
                    Skills: ${user.resume.skills}
                ` },
            ],
            temperature: 0.4,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return gptResponse.choices[0].message.content;
    } catch (error) {
        if (retryCount < 3) {
            return generateExperienceSectionWithRetry(user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error generating experience section after 3 attempts');
        }
    }
}

// Function to handle skills section API call with retries
async function generateSkillsSectionWithRetry(user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Craft a concise skills section for the resume that highlights a broad range of the candidate\'s abilities and competencies. (Don\'t return a Section name or anything like that)' },
                { role: 'user', content: `
                    Experience: ${user.resume.experience}
                    Education and Certifications: ${user.resume.education}
                    Skills: ${user.resume.skills}
                ` },
            ],
            temperature: 0.4,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return gptResponse.choices[0].message.content;
    } catch (error) {
        if (retryCount < 3) {
            return generateSkillsSectionWithRetry(user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error generating skills section after 3 attempts');
        }
    }
}

exports.generate_base_resume = onRequest(
    { cors: true, memory: "512Mi", secrets: ["GPT_API_KEY"] },
    async (req, res) => {
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        try {
            const apiKey = process.env.GPT_API_KEY; // Access secret from environment
            const { user } = req.body;

            try {
                const [summary, experienceSection, skillsSection] = await Promise.all([
                    summarizeResumeWithRetry(user, apiKey).catch(e => `Error: ${e.message}`),
                    generateExperienceSectionWithRetry(user, apiKey).catch(e => `Error: ${e.message}`),
                    generateSkillsSectionWithRetry(user, apiKey).catch(e => `Error: ${e.message}`),
                ]);

                res.status(200).json({
                    summary: { type: "base", data: summary },
                    experienceSection: { type: "base", data: experienceSection },
                    skillsSection: { type: "base", data: skillsSection }
                });
            } catch (error) {
                res.status(500).json({ error: 'Error processing resume: ' + error.message });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error generating resume: ' + error.message });
        }
    }
);
