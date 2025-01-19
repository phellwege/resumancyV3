import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Card, Form, Alert, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsQuestionCircle } from "react-icons/bs";
import { FaMinusSquare , FaPlusSquare  } from "react-icons/fa";

import AddressForm from '../user/AddressForm';
import '../../views/main.css';
import {
    doc,
    setDoc,
} from 'firebase/firestore';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

export default function CreateBaselineResume() {
    const history = useNavigate();
    const {
        user, 
        setUser,
        handleResumeChange,
        sanitizeUserInput,
        handleAddressChange,
        handleExperienceChange,
        addExperienceEntry,
        removeExperienceEntry,
    } = useUser();
    const {
        loading, 
        setLoading
    } = useAuth();

    
    const userExperience = "Detail your relevant job history (Required):";
    const userEducation = "List your education and certifications (Required):";
    const userSkills = "Specify your relevant skills (Required):";
    const userAdditional = "Include any additional relevant information (Optional):";
    const [includeAddress, setIncludeAddress] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        const timeStamp = new Date().toISOString();
        const { experience, education, skills } = user.resume;
        if (!education.trim() || !skills.trim()) {
            setError('Experience, Education, and Skills are required fields.');
            return;
        }
        setUser(prevState => ({
            ...prevState,
            resume: {
                ...prevState.resume,
                usage: {
                    ...prevState.resume.usage,
                    timeStamp: timeStamp,
                    baseResume: true
                }
            }
        }));
        if(includeAddress == true){
            setUser(prevState => ({
                ...prevState,
                resume: {
                    ...prevState.resume,
                    usage: {
                        ...prevState.resume.usage,
                        useAddress: true
                    }
                }
            }));
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                'https://us-central1-resumancy.cloudfunctions.net/generate_base_resume-generate_base_resume',
                { user },
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            const { summary, experienceSection, skillsSection, educationSection } = response.data;
            let parsedExperience = [];
            try {
                parsedExperience = JSON.parse(experienceSection.data);
            } catch (parseError) {
                console.error('Error parsing experience section:', parseError);
                parsedExperience = []; // Fallback to an empty array
            }
            setUser(prevState => {
                const newResume = {
                    ...prevState.resume,
                    summary: summary.data,
                    experience: parsedExperience,
                    skills: skillsSection.data,
                    education: educationSection.data
                };
                return { ...prevState, resume: newResume };
            });
    
            history('/Review');
        } catch (error) {
            console.error('Error generating resume:', error);
            setError('Failed to generate resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='pageWrapper'>
                <div className='cardInnerDiv' id='scratchCardInnerDiv'>
                <Card>
                    <Card.Body>
                        <div className='ScratchInnerDiv'>
                            <h3>Create Base Resume</h3>
                            <p  className="required-note">Fields marked with <span className="required-indicator">*</span> are required.</p>
                            <Form>
                                <div>
                                </div>
                                <Form.Group>
                                    <Form.Label>Want to include your address?</Form.Label>
                                    <br/>
                                <Form.Check
                                        inline
                                        label="Yes"
                                        type={'checkbox'}
                                        onChange={() => setIncludeAddress(true)}
                                        checked={includeAddress}
                                    />
                                    <Form.Check
                                        inline
                                        label="No"
                                        type={'checkbox'}
                                        onChange={() => setIncludeAddress(false)}
                                        checked={!includeAddress}
                                    />
                                    {includeAddress && (
                                        <div>
                                            <sub>
                                                You have the option to include partial address information if you prefer. 
                                                <br/>
                                                Feel free to fill out only the fields you wish to provide.
                                            </sub>
                                            <AddressForm onChange={handleAddressChange}/>
                                        </div>
                                    )}
                                    <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                        Experience<span className="required-indicator">*</span> {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userExperience}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        {/* <sub>({user.resume.experience.length} / 8000)</sub> */}
                                        {/* this will need modified in order to cap each sections */}
                                    </Form.Label>
                                    <div className='createResumePlusAndMinus'>
                                        <FaPlusSquare onClick={addExperienceEntry}  size={25} className='creationButton' id='CreateResumePlusButton'/>
                                    </div>
                                    {user.resume.experience.map((exp, index) => (
                                        <div key={index} className="experience-entry" style={{border: '1px solid lightblue', padding: '5px', margin: '5px', borderRadius: '.5REM'}}>
                                            <Form.Control 
                                                type='text'
                                                placeholder='Job Title'
                                                value={exp.expJobTitle}
                                                onChange={(e) => handleExperienceChange(index, 'expJobTitle', sanitizeUserInput(e.target.value))}
                                                className="mb-2"
                                            />
                                            <Form.Group className="d-flex gap-3 align-items-center">
                                            <Form.Control 
                                                type='text'
                                                placeholder='Company Name'
                                                value={exp.expCompanyName}
                                                onChange={(e) => handleExperienceChange(index, 'expCompanyName', sanitizeUserInput(e.target.value))}
                                                className="mb-2"
                                            />
                                            <Form.Control 
                                                type='text'
                                                placeholder='Employment Duration (e.g., Jan 2020 - Dec 2022)'
                                                value={exp.expTime}
                                                onChange={(e) => handleExperienceChange(index, 'expTime', sanitizeUserInput(e.target.value))}
                                                className="mb-2"
                                                />
                                            </Form.Group>
                                            <Form.Control 
                                                as='textarea'
                                                rows={3}
                                                placeholder='Description'
                                                value={exp.expDesc}
                                                onChange={(e) => handleExperienceChange(index, 'expDesc', sanitizeUserInput(e.target.value))}
                                                className="mb-3"
                                            />
                                            <div className='createResumePlusAndMinus'>
                                                <FaPlusSquare onClick={addExperienceEntry}  size={25} className='creationButton' id='CreateResumePlusButton'/>
                                                <FaMinusSquare onClick={() => removeExperienceEntry(index)} size={25} className='creationButton' id='CreateResumeMinusButton'/>
                                            </div>
                                        </div>
                                    ))}
                                    <Form.Text className='text-muted'>
                                        Work Experience, this should include: Dates of Employment, Employer, Job Title, and a brief description of your role.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                            Education<span className="required-indicator">*</span> {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userEducation}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        <sub>({user.resume.education.length} / 500)</sub>
                                    </Form.Label>
                                    <Form.Control 
                                    as='textarea' 
                                    rows={3} 
                                    placeholder='Education'
                                    value={user.resume.education}
                                    onChange={(e) => handleResumeChange('education', sanitizeUserInput(e.target.value))}
                                    maxLength='500'
                                    className="mobile-textarea"
                                    />
                                    <Form.Text className='text-muted'>
                                        Education and Certifications
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                            Skills<span className="required-indicator">*</span> {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userSkills}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        <sub>({user.resume.skills.length} / 1000)</sub>
                                    </Form.Label>
                                    <Form.Control 
                                    as='textarea' 
                                    rows={2} 
                                    placeholder='Skills'
                                    value={user.resume.skills}
                                    onChange={(e) => handleResumeChange('skills', sanitizeUserInput(e.target.value))}
                                    maxLength='1000'
                                    className="mobile-textarea"
                                    />
                                    <Form.Text className='text-muted'>
                                        Skills relevant to Employment
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                        Anything Additional {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userAdditional}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        <sub>({user.resume.additional.length} / 1000)</sub>
                                    </Form.Label>
                                    <Form.Control 
                                    as='textarea' 
                                    rows={3} 
                                    placeholder='Additional Information' 
                                    value={user.resume.additional}
                                    onChange={(e) => handleResumeChange('additional', sanitizeUserInput(e.target.value))}
                                    maxLength='1000'
                                    className="mobile-textarea"
                                    />
                                    <Form.Text className='text-muted'>
                                        Any additional information you think may be beneficial
                                    </Form.Text>
                                </Form.Group>
                            </Form>
                        </div>
                    </Card.Body>
                </Card>
                <Button 
                    aria-label='submit button'
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                </div>
                <br/>
            </div>
        </>
    )
}