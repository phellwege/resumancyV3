// Prompts ported from the old Cloud Functions (functions/generate*.js) so the
// browser can call OpenAI directly. Prompt text is unchanged.
import { chat } from './openai';

const formatExperience = (resume) =>
    (resume.experience || [])
        .map((item) => `Job Title: ${item.expJobTitle}, Company: ${item.expCompanyName}, Time: ${item.expTime}, Description: ${item.expDesc}`)
        .join('\n');

const formatCustomSections = (resume) =>
    resume.customSections && resume.customSections.length > 0
        ? resume.customSections
              .map((section) => {
                  const entriesText = (section.entries || [])
                      .map((entry) => `Title: ${entry.title}${entry.subtitle ? `, Subtitle: ${entry.subtitle}` : ''}${entry.timeframe ? `, Time: ${entry.timeframe}` : ''}, Description: ${entry.description || 'N/A'}`)
                      .join('\n');
                  return `Section: ${section.sectionName}\n${entriesText}`;
              })
              .join('\n\n')
        : '';

const formatProjects = (resume, customSectionsFormatted) =>
    !customSectionsFormatted && resume.projects && resume.projects.length > 0
        ? resume.projects
              .map((p) => `Project: ${p.projectTitle}${p.projectTime ? `, Time: ${p.projectTime}` : ''}, Summary: ${p.projectSummary || 'N/A'}`)
              .join('\n')
        : '';

const EXPERIENCE_SYSTEM = `
    Craft a compelling experience section for the resume, highlighting the candidate's professional achievements and contributions based solely on the information provided.
    Ensure that:
    - The language is professional, clear, and concise.
    - Factual accuracy is maintained.
    - The "expDesc" field is formatted as a bulleted list with each bullet point separated by a newline character (\\n).
    Return the experience section in the following valid JSON structure (not in a code block):
    [
        {
            "expJobTitle": "Job Title",
            "expCompanyName": "Company Name",
            "expTime": "Employment Duration",
            "expDesc": "• First responsibility or achievement\\n• Second responsibility or achievement\\n• Third responsibility or achievement"
        }
    ]
`;

const SKILLS_SYSTEM = `
    Craft a concise skills section for the resume that highlights a broad range of the candidate's abilities and competencies.
    Ensure that:
    - Formatted as a bulleted list
    - (Don't return a Section name or anything like that)
    - list a maximum of 6 skills
`;

// ---------- JSON parsing for the experience section ----------

function escapeNewlinesInStrings(jsonStr) {
    let inString = false;
    let out = '';
    for (let i = 0; i < jsonStr.length; i++) {
        const char = jsonStr[i];
        if (char === '"') {
            let backslashes = 0;
            for (let j = i - 1; j >= 0 && jsonStr[j] === '\\'; j--) backslashes++;
            if (backslashes % 2 === 0) inString = !inString;
            out += char;
        } else if (inString && (char === '\n' || char === '\r')) {
            out += '\\n';
        } else {
            out += char;
        }
    }
    return out;
}

/** Parses the model's experience JSON. Tolerates code fences and raw newlines. */
export function parseExperience(text, fallback = []) {
    if (!text) return fallback;
    let cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end > start) cleaned = cleaned.slice(start, end + 1);
    try {
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        try {
            const parsed = JSON.parse(escapeNewlinesInStrings(cleaned));
            return Array.isArray(parsed) ? parsed : fallback;
        } catch {
            return fallback;
        }
    }
}

// ---------- Base resume ----------

export async function generateBaseResume(user, { apiKey, model }) {
    const resume = user.resume[0];
    const experienceFormatted = formatExperience(resume);
    const customSectionsFormatted = formatCustomSections(resume);
    const projectsFormatted = formatProjects(resume, customSectionsFormatted);
    const call = (messages, temperature, maxTokens) => chat({ apiKey, model, messages, temperature, maxTokens });

    const [summary, experience, skills, education] = await Promise.all([
        call([
            { role: 'system', content: 'Craft a professional resume summary for this resume in roughly 3 sentences.' },
            { role: 'user', content: `
                Experience: ${experienceFormatted}
                Education and Certifications: ${resume.education}
                Skills: ${resume.skills}
                ${customSectionsFormatted ? `Custom Sections: ${customSectionsFormatted}` : ''}
                ${projectsFormatted ? `Projects: ${projectsFormatted}` : ''}
            ` },
        ], 0.4, 1000),
        call([
            { role: 'system', content: EXPERIENCE_SYSTEM },
            { role: 'user', content: `
                Experience: ${experienceFormatted}
                Education and Certifications: ${resume.education}
                Skills: ${resume.skills}
            ` },
        ], 0.4, 3500),
        call([
            { role: 'system', content: SKILLS_SYSTEM },
            { role: 'user', content: `
                Experience: ${experienceFormatted}
                Education and Certifications: ${resume.education}
                Skills: ${resume.skills}
                ${customSectionsFormatted ? `Custom Sections: ${customSectionsFormatted}` : ''}
                ${projectsFormatted ? `Projects: ${projectsFormatted}` : ''}
            ` },
        ], 0.4, 2000),
        call([
            { role: 'system', content: `
                I am building a resume and need help improving the Education and Certifications section.
                Please ensure the response is concise and limited to key details provided. (Don't return a Section name or anything like that).
            ` },
            { role: 'user', content: `
                "${resume.education}"
                Please rewrite this section in a professional, concise format suitable for a resume.
                Ensure:
                - Key accomplishments or certifications are highlighted succinctly.
                - Avoid adding optional sections like dissertations or publications unless explicitly mentioned.
                - Keep the response brief and professional.
            ` },
        ], 0.4, 500),
    ]);

    return { summary, experience, skills, education };
}

// ---------- Tailored resume ----------

export async function generateTailoredResume(user, job, { apiKey, model }) {
    const resume = user.resume[0];
    const experienceFormatted = formatExperience(resume);
    const customSectionsFormatted = formatCustomSections(resume);
    const projectsFormatted = formatProjects(resume, customSectionsFormatted);
    const call = (messages, temperature, maxTokens) => chat({ apiKey, model, messages, temperature, maxTokens });

    const [summary, experience, skills] = await Promise.all([
        call([
            { role: 'system', content: `
                Craft a concise and professional resume summary (around three sentences) that highlights the candidate's skills, experience, and qualifications in a way that aligns with the provided job description.
                DO NOT mention any company names in the response. Keep the language natural and broadly applicable.
            ` },
            { role: 'user', content: `
                The candidate is applying for a position that requires the following:
                Job Description: ${job.description}
                Company Name (for context, but should NOT be mentioned in the summary): ${job.companyName}

                Here is the user's current resume information:
                  Experience: ${experienceFormatted}
                  Education and Certifications: ${resume.education}
                  Skills: ${resume.skills}
                  ${customSectionsFormatted ? `\nAdditional Resume Sections: ${customSectionsFormatted}` : ''}
                  ${projectsFormatted ? `\nProjects: ${projectsFormatted}` : ''}
            ` },
        ], 0.4, 1000),
        call([
            { role: 'system', content: EXPERIENCE_SYSTEM },
            { role: 'user', content: `
                Please tailor the resume based on the provided job description and company name:
                Job Description: ${job.description}
                Company Name: ${job.companyName}
                Here is the user's current resume information:
                  Experience: ${experienceFormatted}
                  Education and Certifications: ${resume.education}
                  Skills: ${resume.skills}
            ` },
        ], 0.4, 3500),
        call([
            { role: 'system', content: SKILLS_SYSTEM },
            { role: 'user', content: `
                Please customize the skills based on the provided job description and company name while taking into account the users current resume experience:
                Job Description: ${job.description}
                Company Name: ${job.companyName}
                Here is the user's current resume information:
                  Experience: ${experienceFormatted}
                  Education and Certifications: ${resume.education}
                  Skills: ${resume.skills}
            ` },
        ], 0.4, 3500),
    ]);

    return { summary, experience, skills };
}

// ---------- Cover letter ----------

export function generateCoverLetter(user, job, { apiKey, model }) {
    return chat({
        apiKey,
        model,
        temperature: 0.7,
        maxTokens: 500,
        messages: [
            { role: 'system', content: `
                You are a professional assistant tasked with writing concise, compelling cover letters.
                The response must be polite, professional, and error-free, and tailored to the user's resume and job description.
                Use placeholders for unknown information like "Dear Hiring Manager" and omit specific addresses if unavailable.
            ` },
            { role: 'user', content: `
                Write a cover letter for the following job description: ${job.description}.
                Here's a brief summary from their current resume for reference: ${user.resume[0].summary}.
                Additional information:
                First Name: ${user.firstName},
                Last Name: ${user.lastName},
                Company: ${job.companyName}.
                Assume the recipient's name and company address are not provided.
            ` },
        ],
    });
}

// ---------- Gap analysis ----------

export function generateGapAnalysis(user, job, resumeText, missingSkills, { apiKey, model }) {
    const resume = user.resume[0];
    const customSectionsFormatted = formatCustomSections(resume);
    const projectsFormatted = formatProjects(resume, customSectionsFormatted);
    return chat({
        apiKey,
        model,
        temperature: 0.7,
        maxTokens: 1200,
        messages: [
            { role: 'system', content: `
                You are a professional career advisor.
                Please identify the top 3 most impactful skill gaps, providing specific, actionable recommendations and steps for each gap.
                Please prioritize the skill gaps by impact, discussing the top 3 first in detail, then briefly mention any additional minor gaps if needed.
                Include specific suggestions such as online courses or resources where applicable, in order of most impactful for the applicant displayed first.
                Do not include "###", or any similar decoration in your final response; just use plain text, bullet points, or headings.
                Please keep your entire response under 800 words, concluding your analysis completely if you approach the limit.
            ` },
            { role: 'user', content: `
                Job Description: ${job.description}
                Resume Text: ${resumeText}
                Missing Skills: ${missingSkills.join(', ')}
                ${customSectionsFormatted ? `\nAdditional Resume Sections: ${customSectionsFormatted}` : ''}
                ${projectsFormatted ? `\nProjects: ${projectsFormatted}` : ''}

                Please provide a detailed gap analysis with recommendations.
            ` },
        ],
    });
}
