import React from 'react'
import { Link, useNavigate } from "react-router-dom";
// import { getFunctions, httpsCallable } from 'firebase/functions'
import { Button, Card, Alert, OverlayTrigger, Tooltip} from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";

import { useUser } from '../../context/UserContext';

import '../../views/main.css';
export default function CreateCustomTailoredResume() {
    const {
        user, 
        handleTailoredResumeChange,
        sanitizeUserInput,
    } = useUser();
    const companyNameTooltip = "The name of the company you are applying for.";
    const prospectiveJobDescTooltip = "Copy/Paste a description of the role you are applying for.";
    const history = useNavigate();

    const handleSubmit = () => {
        generateTailoredResume(user);
        generateCoverLetter(user)
    }
    const generateTailoredResume = async (user) => {
        try {
        const response = await fetch(
            "https://us-central1-gpt-resume-builder.cloudfunctions.net/generate_tailored_resume-generate_tailored_resume",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: user,
                type: "tailored"
            }),
            }
        );
        if (!response.ok) {
            throw new Error("Failed to generate resume");
        }
        const data = await response.json();
        const summary = data.summary.data
        const experience = data.experience.data
        const skills = data.skills.data
        await handleTailoredResumeChange('summary', summary);
        await handleTailoredResumeChange('experience', experience);
        await handleTailoredResumeChange('skills', skills);
        // setLoading(false);
        // setUserFailsafe(false);
        } catch (error) {
        // setError("Error generating resume:" + error);
        }
    };
    const generateCoverLetter = async (user) => {
        try {
        const response = await fetch(
            "https://us-central1-gpt-resume-builder.cloudfunctions.net/generate_cover_letter-generate_cover_letter",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: user,
            }),
            }
        );
        if (!response.ok) {
            // setError("Failed to generate resume");
        }
        const data = await response.json();
        const coverLetterSummary = data.coverLetterSummary;
        // setCoverLetterContent(coverLetterSummary);
        } catch (error) {
        // setError("Error generating cover letter:" + error);
        }
    };

  return (
    <>
        <div className="pageWrapper">
            <h3>Step 2</h3>
            <div className="secondaryPageWrapper">
            <div className="cardInnerDiv" id="jobDescriptionCardInnerDiv">
                <Card>
                <Card.Body className="cardBody">
                    <h4>
                    Prospective Company Name<span className="required-indicator">*</span> {" "} 
                    <OverlayTrigger 
                    overlay={
                    <Tooltip id="tooltip">
                        {companyNameTooltip}
                    </Tooltip>
                    }>
                    <span className="question-icon">
                        <BsQuestionCircle />
                    </span>
                    </OverlayTrigger>
                    </h4>
                    <textarea
                    rows="1"
                    cols="75"
                    value={user.tailoredResume.companyName}
                    onChange={(e) => handleTailoredResumeChange('companyName', sanitizeUserInput(e.target.value))}
                    placeholder="Enter the prospective company name here..."
                    className="mobile-textarea"
                    />
                    <br />
                    <h4>Prospective Job Description<span className="required-indicator">*</span> {" "} 
                    <OverlayTrigger 
                        overlay={
                        <Tooltip id="tooltip">
                        {prospectiveJobDescTooltip}
                        </Tooltip>
                    }>
                        <span className="question-icon">
                        <BsQuestionCircle />
                        </span>
                    </OverlayTrigger>
                    </h4>
                    <textarea
                    rows="10"
                    cols="75"
                    value={user.tailoredResume.description}
                    onChange={(e) => handleTailoredResumeChange('description', sanitizeUserInput(e.target.value))}
                    placeholder="Enter the prospective job description here..."
                    className="mobile-textarea"
                    />
                    <br />
                    <p  className="required-note">Fields marked with <span className="required-indicator">*</span> are required.</p>
                </Card.Body>
                </Card>
                <Button
                aria-label='submit button'
                onClick={() => {
                    handleSubmit();
                }}
                >
                Submit
                </Button>
            </div>
            </div>
        </div>
    </>
  )
}
