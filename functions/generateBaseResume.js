// Import required modules
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const OpenAI = require('openai');
const apiKey = functions.config().gpt_api.key;
const openai = new OpenAI({ apiKey });

// Function to handle summarization API call with retries
async function summarizeResumeWithRetry(user, retryCount = 0) {
    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `
                        Summarize this resume in roughly 3 sentences
                    `
                },
                {
                    role: 'user',
                    content: `Experience:
                ${user.resume.experience}
                
                Education and Certifications:
                ${user.resume.education}
                
                Skills:
                ${user.resume.skills}
                `
                }
            ],
            temperature: .4,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "{}",
        });
        return gptResponse.choices[0].message.content;
    } catch (error) {
        // Retry logic with up to 3 retries
        if (retryCount < 3) {
            return summarizeResumeWithRetry(user, retryCount + 1);
        } else {
            throw new Error('Error summarizing resume after 3 attempts');
        }
    }
}

// Function to handle experience section API call with retries
async function generateExperienceSectionWithRetry(user, retryCount = 0) {
    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `
                    Craft a compelling experience section for the resume that highlights the candidate's professional achievements and contributions. Focus on showcasing their skills, expertise, and impact in previous roles.
                    `
                },
                {
                    role: 'user',
                    content: `Experience:
                ${user.resume.experience}
                
                Education and Certifications:
                ${user.resume.education}
                
                Skills:
                ${user.resume.skills}
                `
                }
            ],
            temperature: .4,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "{}",
        });
        return gptResponse.choices[0].message.content;
    } catch (error) {
        // Retry logic with up to 3 retries
        if (retryCount < 3) {
            return generateExperienceSectionWithRetry(user, retryCount + 1);
        } else {
            throw new Error('Error summarizing resume after 3 attempts');
        }
    }
}

// Function to handle skills section API call with retries
async function generateSkillsSectionWithRetry(user, retryCount = 0) {
    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `
                    Craft a skills section for the resume that highlights a broad range of the candidate's abilities and competencies. Include both technical skills (such as programming languages, software tools) and soft skills (such as communication, teamwork) that are commonly sought after in various professional settings.
                    `
                },
                {
                    role: 'user',
                    content: `Experience:
                ${user.resume.experience}
                
                Education and Certifications:
                ${user.resume.education}
                
                Skills:
                ${user.resume.skills}
                `
                }
            ],
            temperature: .4,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "{}",
        });
        return gptResponse.choices[0].message.content;
    } catch (error) {
        // Retry logic with up to 3 retries
        if (retryCount < 3) {
            return generateSkillsSectionWithRetry(user, retryCount + 1);
        } else {
            throw new Error('Error summarizing resume after 3 attempts');
        }
    }
}

// Cloud Function to handle HTTP requests
exports.generate_base_resume = functions.https.onRequest(async (request, response) => {
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
            const summary = await summarizeResumeWithRetry(user);
            const experienceSection = await generateExperienceSectionWithRetry(user);
            const skillsSection = await generateSkillsSectionWithRetry(user);

            response.set('Access-Control-Allow-Origin', '*');
            response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
            response.set('Access-Control-Allow-Headers', 'Content-Type');
            response.status(200).json({ 
                summary: { type: "base", data: summary },
                experienceSection: { type: "base", data: experienceSection },
                skillsSection: { type: "base", data: skillsSection }
            });
        } catch (error) {
            response.status(500).send('Error building resume: ' + error.message);
        }
    });
});
