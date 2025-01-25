import React, {useState} from 'react'
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

import { Button, Card, Alert, OverlayTrigger, Tooltip} from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";

import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

import '../../views/main.css';
export default function CreateCustomTailoredResume() {
    const {
        user, 
        setUser,
        handleTailoredResumeChange,
        sanitizeUserInput,
        generateUUID,

        setSuccessMessage,
        setError,
    } = useUser();
    const {
        setLoading
    } = useAuth();
    const companyNameTooltip = "The name of the company you are applying for.";
    const prospectiveJobDescTooltip = "Copy/Paste a description of the role you are applying for.";
    const history = useNavigate();

    const handleSubmit = async () => {
        const newId = generateUUID();
        const timeStamp = new Date().toISOString();
        if (!user.tailoredResume.companyName || !user.tailoredResume.description) {
            setError("Company name and job description are required.");
            return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
            await generateTailoredResume(user, newId, timeStamp);
            await generateCoverLetter(user, newId, timeStamp);
            history("/Review");
        } catch (error) {
            console.error("Error during submission:", error);
            setError("Failed to generate documents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const generateTailoredResume = async (user, newId, timeStamp) => {
        try {
            const response = await axios.post(
                "https://us-central1-resumancy.cloudfunctions.net/generate_tailored_resume-generate_tailored_resume",
                { user },
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            const { summary, experienceSection, skillsSection } = response.data;
    
            let parsedExperience = [];
            let parsedSkills = [];
    
            // Parse experience section if it exists
            if (experienceSection && experienceSection.data) {
                try {
                    parsedExperience = JSON.parse(experienceSection.data);
                } catch (parseError) {
                    console.error("Error parsing experience section:", parseError);
                    parsedExperience = [];
                }
            } else {
                console.warn("Experience section is missing or empty.");
            }
    
            if (skillsSection && skillsSection.data) {
                parsedSkills = skillsSection.data;
            } else {
                console.warn("Skills section is missing or empty.");
            }
    
            // old Update user state
            setUser((prevState) => ({
                ...prevState,
                resume: {
                    ...prevState.resume,
                    summary: summary?.data || prevState.resume.summary,
                    experience: parsedExperience,
                    skills: parsedSkills,
                    usage: {
                        ...prevState.resume.usage,
                        baseResume: false,
                    },
                },
            }));

            // adapt this to tailored resumes
            // const updatedUser = {
            //     ...user,
            //     resume: [
            //         {
            //             ...user.resume[0],
            //             id: newId,
            //             summary: summary.data,
            //             experience: parsedExperience,
            //             skills: skillsSection.data,
            //             education: educationSection.data,
            //             usage: {
            //                 ...user.resume[0].usage,
            //                 timeStamp,
            //                 baseResume: false,
            //                 useAddress: includeAddress,
            //             },
            //         },
            //     ],
            //     subscription: {
            //         ...user.subscription,
            //         usage: {
            //             ...user.subscription.usage,
            //             tailoredResumes: +1,
            //         },
            //     },
            // };
    
            // addNewResume(updatedUser);
    
            // await saveBaselineResume(updatedUser.id, {
            //     resume: updatedUser.resume,
            //     subscription: updatedUser.subscription,
            // });


        } catch (error) {
            console.error("Error generating tailored resume:", error);
            setError("Failed to generate tailored resume. Please try again.");
        }
    };
    
    const generateCoverLetter = async (user, newId, timeStamp) => {
        try {
        const response = await axios.post(
            "https://us-central1-resumancy.cloudfunctions.net/generate_cover_letter-generate_cover_letter",
            { user },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (!response.ok) {
            setError("Failed to generate resume");
        }

        const coverLetterSummary = response.data.coverLetterSummary;

        setUser((prevState) => ({
            ...prevState,
            coverLetter: {
                ...prevState.coverLetter,
                id: newId,
                createdAt: timeStamp,
                response: coverLetterSummary,
            },
        }));

        } catch (error) {
            setError("Error generating cover letter:" + error);
            throw new Error("Failed to generate cover letter.");
        }
    };

  return (
    <>
        <div className="pageWrapper">
            <h5>Tailor Your Resume To The Job</h5>
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
