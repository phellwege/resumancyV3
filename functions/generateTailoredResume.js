// Import required modules
const { onRequest } = require("firebase-functions/v2/https");
const OpenAI = require('openai');

// Function to handle summarization API call with retries
async function summarizeResumeWithRetry(selectedTailoredResumeIdData, user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });
    const experienceFormatted = user.resume[0].experience.map(item => {
        return `Job Title: ${item.expJobTitle}, Company: ${item.expCompanyName}, Time: ${item.expTime}, Description: ${item.expDesc}`;
    }).join("\n");

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Craft a professional resume summary for this resume in roughly 3 sentences.' },
                { role: 'user', content: `
                    Please customize the resume based on the provided job description and company name:
                    Job Description: ${selectedTailoredResumeIdData.description}
                    Company Name: ${selectedTailoredResumeIdData.companyName}
                    Here is the user's current resume information:
                        Experience: ${experienceFormatted}
                        Education and Certifications: ${user.resume[0].education}
                        Skills: ${user.resume[0].skills}
                ` },
            ],
            temperature: 0.4,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return gptResponse.choices[0].message.content;
    } catch (error) {
        if (retryCount < 3) {
            return summarizeResumeWithRetry(selectedTailoredResumeIdData, user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error summarizing resume after 3 attempts');
        }
    }
}

// Function to handle experience section API call with retries
async function generateExperienceSectionWithRetry(selectedTailoredResumeIdData, user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });
    const experienceFormatted = user.resume[0].experience.map(item => {
        return `Job Title: ${item.expJobTitle}, Company: ${item.expCompanyName}, Time: ${item.expTime}, Description: ${item.expDesc}`;
    }).join("\n");

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: `
                        Craft a compelling experience section for the resume, highlighting the candidate's professional achievements and contributions based solely on the information provided. 
                        Ensure that:
                        - The language is professional, clear, and concise.
                        - Factual accuracy is maintained.
                        - The "expDesc" field is formatted as a bulleted list with each bullet point separated by a newline character (\n).
                        Return the experience section in the following valid JSON structure (not in a code block):
                        [
                            {
                                "expJobTitle": "Job Title",
                                "expCompanyName": "Company Name",
                                "expTime": "Employment Duration",
                                "expDesc": "• First responsibility or achievement\n• Second responsibility or achievement\n• Third responsibility or achievement"
                            }
                        ]
                    ` 
                },
                { role: 'user', content: `
                    Please tailor the resume based on the provided job description and company name:
                    Job Description: ${selectedTailoredResumeIdData.description}
                    Company Name: ${selectedTailoredResumeIdData.companyName}
                    Here is the user's current resume information:
                        Experience: ${experienceFormatted}
                        Education and Certifications: ${user.resume[0].education}
                        Skills: ${user.resume[0].skills}
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
            return generateExperienceSectionWithRetry(selectedTailoredResumeIdData, user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error generating experience section after 3 attempts');
        }
    }
}

// Function to handle skills section API call with retries
async function generateSkillsSectionWithRetry(selectedTailoredResumeIdData, user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });
    const experienceFormatted = user.resume[0].experience.map(item => {
        return `Job Title: ${item.expJobTitle}, Company: ${item.expCompanyName}, Time: ${item.expTime}, Description: ${item.expDesc}`;
    }).join("\n");

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: `
                        Craft a concise skills section for the resume that highlights a broad range of the candidate\'s abilities and competencies. 
                        Ensure that:
                        - Formatted as a bulleted list 
                        - (Don\'t return a Section name or anything like that)
                        - list a maximum of 6 skills
                    `
                },
                { 
                    role: 'user', 
                    content: `
                    Please customize the skills based on the provided job description and company name while taking into account the users current resume experience:
                    Job Description: ${selectedTailoredResumeIdData.description}
                    Company Name: ${selectedTailoredResumeIdData.companyName}
                    Here is the user's current resume information:
                        Experience: ${experienceFormatted}
                        Education and Certifications: ${user.resume[0].education}
                        Skills: ${user.resume[0].skills}
                ` 
                },
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
            return generateSkillsSectionWithRetry(selectedTailoredResumeIdData, user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error generating skills section after 3 attempts');
        }
    }
}

exports.generate_tailored_resume = onRequest(
    { cors: true, memory: "512Mi", secrets: ["GPT_API_KEY"] },
    async (req, res) => {
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        try {
            const apiKey = process.env.GPT_API_KEY;
            const { user, selectedTailoredResumeIdData } = req.body;

            try {
                const [summary, experienceSection, skillsSection] = await Promise.all([
                    summarizeResumeWithRetry(selectedTailoredResumeIdData, user, apiKey).catch(e => `Error: ${e.message}`),
                    generateExperienceSectionWithRetry(selectedTailoredResumeIdData, user, apiKey).catch(e => `Error: ${e.message}`),
                    generateSkillsSectionWithRetry(selectedTailoredResumeIdData, user, apiKey).catch(e => `Error: ${e.message}`),
                ]);

                res.status(200).json({
                    summary: { type: "tailored", data: summary },
                    experienceSection: { type: "tailored", data: experienceSection },
                    skillsSection: { type: "tailored", data: skillsSection }
                });
            } catch (error) {
                res.status(500).json({ error: 'Error processing resume: ' + error.message });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error generating resume: ' + error.message });
        }
    }
);
