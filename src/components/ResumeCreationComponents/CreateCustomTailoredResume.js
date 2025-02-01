import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { BsQuestionCircle } from "react-icons/bs";
import { Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";

import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

import '../../views/main.css';
import { useData } from '../../context/DataContext';

export default function CreateCustomTailoredResume() {
    const {
        user, 
        setUser,
        handleTailoredResumeChange,
        sanitizeUserInput,
        generateUUID,
        setSelectedTailoredResumeId,
        selectedTailoredResumeIdData,

        setSuccessMessage,
        setError,
    } = useUser();
    const {
        setLoading
    } = useAuth();
    const {
        addTailoredResume,
        addCoverLetter
    } = useData();

    const history = useNavigate();

    const companyNameTooltip = "The name of the company you are applying for.";
    const prospectiveJobDescTooltip = "Copy/Paste a description of the role you are applying for.";

    const handleSubmit = async () => {
        setLoading(true);
        const newId = generateUUID();
        const timeStamp = new Date().toISOString();
        setSelectedTailoredResumeId(newId);

        setError(null);

        const firstResume = user.tailoredResume[0];
        if (!firstResume.companyName || !firstResume.description) {
            setError("Company name and job description are required.");
            return;
        }
        
        try {
            const finalizedResume = {
                ...firstResume,
                id: newId,
                createdAt: timeStamp,
            };
    
            await generateTailoredResume(finalizedResume, user, newId, timeStamp);
            
            await generateCoverLetter(finalizedResume, user, newId, timeStamp);
    
            setUser((prevUser) => ({
                ...prevUser,
                tailoredResume: [
                    {
                        id: null,
                        createdAt: null,
                        companyName: '',
                        description: '',
                    },
                    ...prevUser.tailoredResume.filter(resume => resume.id !== null),
                    finalizedResume,
                ],
            }));
    
            history("/Review");
        } catch (error) {
            console.error("Error during submission:", error);
            setError("Failed to generate documents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const generateTailoredResume = async (selectedTailoredResumeIdData, user, newId, timeStamp) => {
        try {
            const response = await axios.post(
                "https://us-central1-resumancy.cloudfunctions.net/generate_tailored_resume-generate_tailored_resume",
                { user, selectedTailoredResumeIdData },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { summary, experienceSection, skillsSection } = response.data;
    
            let parsedExperience = experienceSection?.data ? JSON.parse(experienceSection.data) : [];
            let parsedSkills = skillsSection?.data || [];

            const tailoredResume = {
                ...user.resume[0],
                id: newId,
                summary: summary?.data || user.resume[0].summary,
                experience: parsedExperience,
                skills: parsedSkills,
                usage: {
                    ...user.resume[0].usage,
                    timeStamp: timeStamp,
                    baseResume: false,
                },
            };

            const tailoredResumeEntry = {
                id: newId,
                createdAt: timeStamp,
                companyName: selectedTailoredResumeIdData.companyName,
                description: selectedTailoredResumeIdData.description,
            };

            await addTailoredResume(user.id, tailoredResume, tailoredResumeEntry);

            setUser((prevState) => ({
            ...prevState,
            resume: [...prevState.resume, tailoredResume],
        }));

        } catch (error) {
            console.error("Error generating tailored resume:", error);
            setError("Failed to generate tailored resume. Please try again.");
        }
    };

    const generateCoverLetter = async (selectedTailoredResumeIdData, user,  newId, timeStamp) => {
        try {
        const response = await axios.post(
            "https://us-central1-resumancy.cloudfunctions.net/generate_cover_letter-generate_cover_letter",
            { user, selectedTailoredResumeIdData },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const coverLetterSummary = response.data.coverLetterSummary;
        
        const newCoverLetter = {
            id: newId,
            createdAt: timeStamp,
            response: coverLetterSummary,
        };

        await addCoverLetter(user.id, newCoverLetter);

        setUser((prevState) => ({
            ...prevState,
            coverLetter: [...prevState.coverLetter, newCoverLetter],
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
                    value={user.tailoredResume[0]?.companyName}
                    onChange={(e) => handleTailoredResumeChange(0, 'companyName', sanitizeUserInput(e.target.value))}
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
                    value={user.tailoredResume[0]?.description}
                    onChange={(e) => handleTailoredResumeChange(0, 'description', sanitizeUserInput(e.target.value))}
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