import React from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { BsQuestionCircle } from "react-icons/bs";
import { Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";

import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useData } from '../../context/DataContext';

import '../../views/main.css';
import { extractResumeText, calculateHybridMatchPercent } from '../user/SendMatch';

// --------------------------------------------------
// 1) Helper to escape newlines only when inside strings
// --------------------------------------------------
function escapeNewlinesInStrings(jsonStr) {
  let inString = false;
  let escaped = '';
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    if (char === '"') {
      // Check if the quote is escaped by counting preceding backslashes.
      let escapeCount = 0;
      let j = i - 1;
      while (j >= 0 && jsonStr[j] === '\\') {
        escapeCount++;
        j--;
      }
      // If even number of backslashes, the quote is not escaped.
      if (escapeCount % 2 === 0) {
        inString = !inString;
      }
      escaped += char;
    } else if (inString && (char === '\n' || char === '\r')) {
      escaped += '\\n';
    } else {
      escaped += char;
    }
  }
  return escaped;
}

// --------------------------------------------------
// 2) Fallback JSON parser for the experience section
// --------------------------------------------------
function parseExperienceData(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn("Initial JSON.parse failed; attempting to escape newlines inside strings.", e);
    const sanitized = escapeNewlinesInStrings(data);
    return JSON.parse(sanitized);
  }
}

export default function CreateCustomTailoredResume() {
  const {
    user,
    setUser,
    handleTailoredResumeChange,
    sanitizeUserInput,
    generateUUID,
    setSelectedTailoredResumeId,
    canCreateMore,
    setSuccessMessage,
    setError,
  } = useUser();

  const { setLoading } = useAuth();
  const { addTailoredResume, addCoverLetter } = useData();
  const history = useNavigate();

  const companyNameTooltip = "The name of the company you are applying for.";
  const prospectiveJobDescTooltip = "Paste a job description of the role you are applying for.";

  const generateTailoredResume = async (jobData, currentUser) => {
    try {
      const response = await axios.post(
        "https://us-central1-resumancy.cloudfunctions.net/generate_tailored_resume-generate_tailored_resume",
        { user: currentUser, selectedTailoredResumeIdData: jobData },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { summary, experienceSection, skillsSection } = response.data;

      const parsedExperience = experienceSection?.data
        ? parseExperienceData(experienceSection.data)
        : [];
      const parsedSkills = skillsSection?.data || [];

      return {
        ...currentUser.resume[0],
        id: jobData.id,
        summary: summary?.data || currentUser.resume[0].summary,
        experience: parsedExperience,
        skills: parsedSkills,
        usage: {
          ...currentUser.resume[0].usage,
          timeStamp: jobData.createdAt,
          baseResume: false,
        },
      };
    } catch (error) {
      console.error("Error generating tailored resume:", error);
      throw new Error("Failed to generate tailored resume.");
    }
  };

  const generateCoverLetter = async (jobData, currentUser) => {
    try {
      const response = await axios.post(
        "https://us-central1-resumancy.cloudfunctions.net/generate_cover_letter-generate_cover_letter",
        { user: currentUser, selectedTailoredResumeIdData: jobData },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data.coverLetterSummary;
    } catch (error) {
      console.error("Error generating cover letter:", error);
      throw new Error("Failed to generate cover letter.");
    }
  };

  const performGapAnalysis = async (finalizedResume, jobData, currentUser) => {
    const resumeText = extractResumeText(finalizedResume);
    try {
      const gapResponse = await axios.post(
        "https://us-central1-resumancy.cloudfunctions.net/generateGapAnalysisWithRetry-generate_gap_analysis",
        {
          user: currentUser,
          selectedTailoredResumeIdData: {
            id: finalizedResume.id,
            description: jobData.description,
            companyName: jobData.companyName,
          },
          resumeText,
          missingSkills: [],
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return gapResponse.data.gapAnalysis;
    } catch (error) {
      console.error("Error performing gap analysis:", error);
      throw new Error("Failed to perform gap analysis.");
    }
  };

  const handleSubmit = async () => {
    // Check subscription
    if (!canCreateMore("tailoredResumes")) {
      history('/OverLimit');
      setError("You have reached the maximum number of tailored resumes for your subscription.");
      return;
    }

    setLoading(true);
    setError(null);

    const firstResume = user.tailoredResume[0];
    if (!firstResume.companyName || !firstResume.description) {
      setLoading(false);
      setError("Company name and job description are required.");
      return;
    }

    const newId = generateUUID();
    const timeStamp = new Date().toISOString();
    setSelectedTailoredResumeId(newId);

    const jobData = {
      id: newId,
      createdAt: timeStamp,
      companyName: firstResume.companyName,
      description: firstResume.description,
    };

    try {
      const tailoredResume = await generateTailoredResume(jobData, user);

      const coverLetterText = await generateCoverLetter(jobData, user);

      const skillGapAnalysis = await performGapAnalysis(tailoredResume, jobData, user);

      const resumeText = extractResumeText(tailoredResume);
      const matchPercent = await calculateHybridMatchPercent(resumeText, jobData.description);

      const tailoredResumeEntry = {
        ...jobData,
        skillGapAnalysis,
        matchPercent,
      };

      await addTailoredResume(user.id, tailoredResume, tailoredResumeEntry);

      const newCoverLetter = {
        id: newId,
        createdAt: timeStamp,
        response: coverLetterText,
      };
      await addCoverLetter(user.id, newCoverLetter);

      setUser((prevUser) => ({
        ...prevUser,
        tailoredResume: [
          {
            id: null,
            createdAt: null,
            companyName: '',
            description: '',
            matchPercent: '',
            skillGapAnalysis: '',
          },
          ...prevUser.tailoredResume.filter((tr) => tr.id !== null),
          tailoredResumeEntry,
        ],
        coverLetter: [...prevUser.coverLetter, newCoverLetter],
      }));

      setSuccessMessage(
        "✅ Your resume has been successfully tailored for this job. Review the changes to make sure everything looks just right!"
      );
      history("/Review");

    } catch (error) {
      console.error("Error during submission:", error);
      setError(error?.message || "Failed to process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageWrapper">
      <h5>Tailor Your Resume To The Job</h5>
      <div className="secondaryPageWrapper">
        <div className="cardInnerDiv" id="jobDescriptionCardInnerDiv">
          <Card>
            <Card.Body className="cardBody">
              <h4>
                Prospective Company Name
                <span className="required-indicator">*</span>{" "}
                <OverlayTrigger overlay={<Tooltip id="tooltip">{companyNameTooltip}</Tooltip>}>
                  <span className="question-icon">
                    <BsQuestionCircle />
                  </span>
                </OverlayTrigger>
              </h4>
              <textarea
                rows="1"
                cols="75"
                value={user.tailoredResume[0]?.companyName || ""}
                onChange={(e) =>
                  handleTailoredResumeChange(
                    0,
                    'companyName',
                    sanitizeUserInput(e.target.value)
                  )
                }
                placeholder="Enter the prospective company name here..."
                className="mobile-textarea"
              />
              <br />

              <h4>
                Prospective Job Description
                <span className="required-indicator">*</span>{" "}
                <OverlayTrigger
                  overlay={<Tooltip id="tooltip">{prospectiveJobDescTooltip}</Tooltip>}
                >
                  <span className="question-icon">
                    <BsQuestionCircle />
                  </span>
                </OverlayTrigger>
              </h4>
              <textarea
                rows="10"
                cols="75"
                value={user.tailoredResume[0]?.description || ""}
                onChange={(e) =>
                  handleTailoredResumeChange(
                    0,
                    'description',
                    sanitizeUserInput(e.target.value)
                  )
                }
                placeholder="Enter the prospective job description here..."
                className="mobile-textarea"
              />

              <br />
              <p className="required-note">
                Fields marked with <span className="required-indicator">*</span> are required.
              </p>
            </Card.Body>
          </Card>

          <Button aria-label="submit button" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
