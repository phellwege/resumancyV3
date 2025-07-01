const { onRequest } = require("firebase-functions/v2/https");
const OpenAI = require('openai');
const admin = require('firebase-admin');

async function summarizeResumeWithRetry(user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });
    const experienceFormatted = user.resume[0].experience.map(item => {
        return `Job Title: ${item.expJobTitle}, Company: ${item.expCompanyName}, Time: ${item.expTime}, Description: ${item.expDesc}`;
    }).join("\n");
    
    // Format custom sections if they exist
    const customSectionsFormatted = user.resume[0].customSections && user.resume[0].customSections.length > 0 ?
        user.resume[0].customSections.map(section => {
            const entriesText = section.entries.map(entry => {
                return `Title: ${entry.title}${entry.subtitle ? `, Subtitle: ${entry.subtitle}` : ''}${entry.timeframe ? `, Time: ${entry.timeframe}` : ''}, Description: ${entry.description || 'N/A'}`;
            }).join("\n");
            return `Section: ${section.sectionName}\n${entriesText}`;
        }).join("\n\n") : '';
    
    // Legacy projects section fallback
    const projectsFormatted = !customSectionsFormatted && user.resume[0].projects && user.resume[0].projects.length > 0 ?
        user.resume[0].projects.map(project => {
            return `Project: ${project.projectTitle}${project.projectTime ? `, Time: ${project.projectTime}` : ''}, Summary: ${project.projectSummary || 'N/A'}`;
        }).join("\n") : '';

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: 'Craft a professional resume summary for this resume in roughly 3 sentences.' 
                },
                { 
                    role: 'user', 
                    content: `
                    Experience: ${experienceFormatted}
                    Education and Certifications: ${user.resume[0].education}
                    Skills: ${user.resume[0].skills}
                    ${customSectionsFormatted ? `Custom Sections: ${customSectionsFormatted}` : ''}
                    ${projectsFormatted ? `Projects: ${projectsFormatted}` : ''}
                ` 
                },
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
            return summarizeResumeWithRetry(user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error summarizing resume after 3 attempts');
        }
    }
}

// Function to handle experience section API call with retries
async function generateExperienceSectionWithRetry(user, apiKey, retryCount = 0) {
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
                    content:  `
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
            return generateExperienceSectionWithRetry(user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error generating experience section after 3 attempts');
        }
    }
}

// Function to handle skills section API call with retries
async function generateSkillsSectionWithRetry(user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });
    const experienceFormatted = user.resume[0].experience.map(item => {
        return `Job Title: ${item.expJobTitle}, Company: ${item.expCompanyName}, Time: ${item.expTime}, Description: ${item.expDesc}`;
    }).join("\n");
    
    // Format custom sections if they exist
    const customSectionsFormatted = user.resume[0].customSections && user.resume[0].customSections.length > 0 ?
        user.resume[0].customSections.map(section => {
            const entriesText = section.entries.map(entry => {
                return `Title: ${entry.title}${entry.subtitle ? `, Subtitle: ${entry.subtitle}` : ''}${entry.timeframe ? `, Time: ${entry.timeframe}` : ''}, Description: ${entry.description || 'N/A'}`;
            }).join("\n");
            return `Section: ${section.sectionName}\n${entriesText}`;
        }).join("\n\n") : '';
    
    // Legacy projects section fallback
    const projectsFormatted = !customSectionsFormatted && user.resume[0].projects && user.resume[0].projects.length > 0 ?
        user.resume[0].projects.map(project => {
            return `Project: ${project.projectTitle}${project.projectTime ? `, Time: ${project.projectTime}` : ''}, Summary: ${project.projectSummary || 'N/A'}`;
        }).join("\n") : '';

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: `
                        Craft a concise skills section for the resume that highlights a broad range of the candidate's abilities and competencies. 
                        Ensure that:
                        - Formatted as a bulleted list 
                        - (Don't return a Section name or anything like that)
                        - list a maximum of 6 skills
                    ` 
                },
                { 
                    role: 'user', 
                    content: `
                        Experience: ${experienceFormatted}
                        Education and Certifications: ${user.resume[0].education}
                        Skills: ${user.resume[0].skills}
                        ${customSectionsFormatted ? `Custom Sections: ${customSectionsFormatted}` : ''}
                        ${projectsFormatted ? `Projects: ${projectsFormatted}` : ''}
                    ` 
                },
            ],
            temperature: 0.4,
            max_tokens: 2000,
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

// Function to improve education section with retries
async function improveEducationSection(user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: `
                    I am building a resume and need help improving the Education and Certifications section. 
                    Please ensure the response is concise and limited to key details provided. (Don't return a Section name or anything like that).
                    `
                },
                { 
                    role: 'user', 
                    content: `
                    "${user.resume[0].education}"
                    Please rewrite this section in a professional, concise format suitable for a resume. 
                    Ensure:
                    - Key accomplishments or certifications are highlighted succinctly.
                    - Avoid adding optional sections like dissertations or publications unless explicitly mentioned.
                    - Keep the response brief and professional.
                    ` 
                },
            ],
            temperature: 0.4,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return gptResponse.choices[0].message.content;
    } catch (error) {
        if (retryCount < 3) {
            return improveEducationSection(user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error generating education section after 3 attempts');
        }
    }
}

async function improveCustomSection(user, apiKey, retryCount = 0) {
    const openai = new OpenAI({ apiKey });

    const customSectionsFormatted = user.resume[0].customSections && user.resume[0].customSections.length > 0 ?
        user.resume[0].customSections.map(section => {
            const entriesText = section.entries.map(entry => {
                return `Title: ${entry.title}${entry.subtitle ? `, Subtitle: ${entry.subtitle}` : ''}${entry.timeframe ? `, Time: ${entry.timeframe}` : ''}, Description: ${entry.description || 'N/A'}`;
            }).join("\n");
            return `Section: ${section.sectionName}\n${entriesText}`;
        }).join("\n\n") : '';

    // If no custom sections exist, return empty
    if (!customSectionsFormatted) {
        return '';
    }


    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: `
                    I am building a resume and need help improving custom sections.
                    Please ensure the response is concise and limited to key details provided.
                    Format each section professionally and maintain the original structure.
                    `
                },
                { 
                    role: 'user', 
                    content: `
                    ${customSectionsFormatted}
                    Please rewrite this section in a professional, concise format suitable for a resume. 
                    Ensure:
                    - Key accomplishments are highlighted succinctly.
                    - Keep the response brief and professional.
                    - Maintain the section names and structure.
                    ` 
                },
            ],
            temperature: 0.4,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return gptResponse.choices[0].message.content;
    } catch (error) {
        if (retryCount < 3) {
            return improveCustomSection(user, apiKey, retryCount + 1);
        } else {
            throw new Error('Error generating custom section after 3 attempts');
        }
    }
}

exports.generate_base_resume = onRequest(
    { cors: true, memory: "512Mi", secrets: ["GPT_API_KEY"] },
    async (req, res) => {
        // Handle CORS preflight request
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        // Authorization check: verify Firebase ID token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        }
        const idToken = authHeader.split('Bearer ')[1];

        try {
            await admin.auth().verifyIdToken(idToken);

            const apiKey = process.env.GPT_API_KEY;
            const { user } = req.body;
            if (!user) {
                return res.status(400).json({ error: "Missing required parameters." });
            }

            try {
                const [summary, experienceSection, skillsSection, educationSection] = await Promise.all([
                    summarizeResumeWithRetry(user, apiKey).catch(e => `Error: ${e.message}`),
                    generateExperienceSectionWithRetry(user, apiKey).catch(e => `Error: ${e.message}`),
                    generateSkillsSectionWithRetry(user, apiKey).catch(e => `Error: ${e.message}`),
                    improveEducationSection(user, apiKey).catch(e => `Error: ${e.message}`),
                    improveCustomSection(user, apiKey).catch(e => `Error: ${e.message}`),
                ]);

                res.status(200).json({
                    summary: { type: "base", data: summary },
                    experienceSection: { type: "base", data: experienceSection },
                    skillsSection: { type: "base", data: skillsSection },
                    educationSection: { type: "base", data: educationSection },
                    customSection: { type: "base", data: customSection }
                });
            } catch (error) {
                res.status(500).json({ error: 'Error processing resume: ' + error.message });
            }
        } catch (error) {
            res.status(401).json({ error: 'Unauthorized: ' + error.message });
        }
    }
);
