import React from 'react';
import { useNavigate } from "react-router-dom";

import { BsQuestionCircle } from "react-icons/bs";
import { Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";

import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useData } from '../../context/DataContext';

import '../../views/main.css';
import { extractResumeText, calculateHybridMatchPercent } from '../user/SendMatch';
import { generateTailoredResume as aiTailor, generateCoverLetter as aiCoverLetter, generateGapAnalysis as aiGap, parseExperience } from '../../lib/resumeAI';

export default function CreateCustomTailoredResume() {
  const {
    user,
    setUser,
    handleTailoredResumeChange,
    sanitizeUserInput,
    generateUUID,
    setSelectedTailoredResumeId,
    setSuccessMessage,
    setError,
    handleOpenLoginModal,
  } = useUser();

  const { setLoading, apiKey, model } = useAuth();
  const { addTailoredResume, addCoverLetter } = useData();
  const ai = { apiKey, model };
  const history = useNavigate();
  const companyNameTooltip = "The name of the company you are applying for.";
  const prospectiveJobDescTooltip = "Paste a job description of the role you are applying for.";

  const generateTailoredResume = async (jobData, currentUser) => {
    const { summary, experience, skills } = await aiTailor(currentUser, jobData, ai);
    return {
      ...currentUser.resume[0],
      id: jobData.id,
      summary: summary || currentUser.resume[0].summary,
      experience: parseExperience(experience, currentUser.resume[0].experience),
      skills: skills || currentUser.resume[0].skills,
      usage: {
        ...currentUser.resume[0].usage,
        timeStamp: jobData.createdAt,
        baseResume: false,
      },
    };
  };

  const generateCoverLetter = (jobData, currentUser) => aiCoverLetter(currentUser, jobData, ai);

  const performGapAnalysis = (finalizedResume, jobData, currentUser) =>
    aiGap(currentUser, jobData, extractResumeText(finalizedResume), [], ai);

  const handleSubmit = async () => {
    if (!apiKey) {
      setError("Add your OpenAI API key first.");
      handleOpenLoginModal();
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
      // Cover letter and gap analysis only need the tailored resume, so run them together.
      const tailoredResume = await generateTailoredResume(jobData, user);
      const [coverLetterText, skillGapAnalysis] = await Promise.all([
        generateCoverLetter(jobData, user),
        performGapAnalysis(tailoredResume, jobData, user),
      ]);

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

      // Clear the job form (slot 0); the entries were stored above.
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
        ],
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
                    "companyName",
                    sanitizeUserInput(e.target.value)
                  )
                }
                placeholder="Enter the prospective company name here..."
                className="mobile-textarea form-control"
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
                    "description",
                    sanitizeUserInput(e.target.value)
                  )
                }
                placeholder="Enter the prospective job description here..."
                className="mobile-textarea form-control"
              />

              <br />
              <p className="required-note">
                Fields marked with <span className="required-indicator">*</span> are required.
              </p>
            </Card.Body>
          </Card>

          <Button 
            aria-label="submit button" 
            onClick={handleSubmit}
            className="mt-3 btn-lg"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
