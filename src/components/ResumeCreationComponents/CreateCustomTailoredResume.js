import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { BsQuestionCircle } from "react-icons/bs";
import { Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";

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
    console.log(user)
    
    const {
        setLoading
    } = useAuth();
    const history = useNavigate();

    const companyNameTooltip = "The name of the company you are applying for.";
    const prospectiveJobDescTooltip = "Copy/Paste a description of the role you are applying for.";

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
    
            // Parse skills section
            if (skillsSection && skillsSection.data) {
                parsedSkills = skillsSection.data;
            } else {
                console.warn("Skills section is missing or empty.");
            }
    
            // Create the new tailored resume object
            const tailoredResume = {
                ...user.resume[0],  // Copy base resume data
                id: newId,
                summary: summary?.data || user.resume[0].summary,
                experience: parsedExperience,
                skills: parsedSkills,
                usage: {
                    ...user.resume[0].usage,
                    timeStamp: timeStamp,
                    baseResume: false,  // Mark this as a tailored resume
                },
            };
    
            // Use a callback to update the state correctly
            setUser((prevState) => {
                return {
                    ...prevState,
                    resume: [...prevState.resume, tailoredResume],
                    subscription: {
                        ...prevState.subscription,
                        usage: {
                            ...prevState.subscription.usage,
                            tailoredResumes: prevState.subscription.usage.tailoredResumes + 1,  // Increment tailored resumes
                        },
                    },
                };
            });
    
        } catch (error) {
            console.error("Error generating tailored resume:", error);
            setError("Failed to generate tailored resume. Please try again.");
        }
    };

    // const generateTailoredResume = async (user, newId, timeStamp) => {
    //     try {
    //         const response = await axios.post(
    //             "https://us-central1-resumancy.cloudfunctions.net/generate_tailored_resume-generate_tailored_resume",
    //             { user },
    //             { headers: { 'Content-Type': 'application/json' } }
    //         );
    
    //         const { summary, experienceSection, skillsSection } = response.data;
    
    //         let parsedExperience = [];
    //         let parsedSkills = [];
    
    //         // Parse experience section if it exists
    //         if (experienceSection && experienceSection.data) {
    //             try {
    //                 parsedExperience = JSON.parse(experienceSection.data);
    //             } catch (parseError) {
    //                 console.error("Error parsing experience section:", parseError);
    //                 parsedExperience = [];
    //             }
    //         } else {
    //             console.warn("Experience section is missing or empty.");
    //         }
    
    //         if (skillsSection && skillsSection.data) {
    //             parsedSkills = skillsSection.data;
    //         } else {
    //             console.warn("Skills section is missing or empty.");
    //         }
    
    //         // old Update user state
    //         setUser((prevState) => ({
    //             ...prevState,
    //             resume: {
    //                 ...prevState.resume,
    //                 summary: summary?.data || prevState.resume.summary,
    //                 experience: parsedExperience,
    //                 skills: parsedSkills,
    //                 usage: {
    //                     ...prevState.resume.usage,
    //                     baseResume: false,
    //                 },
    //             },
    //         }));

    //         // adapt this to tailored resumes
    //         // const updatedUser = {
    //         //     ...user,
    //         //     resume: [
    //         //         {
    //         //             ...user.resume[0],
    //         //             id: newId,
    //         //             summary: summary.data,
    //         //             experience: parsedExperience,
    //         //             skills: skillsSection.data,
    //         //             education: educationSection.data,
    //         //             usage: {
    //         //                 ...user.resume[0].usage,
    //         //                 timeStamp,
    //         //                 baseResume: false,
    //         //                 useAddress: includeAddress,
    //         //             },
    //         //         },
    //         //     ],
    //         //     subscription: {
    //         //         ...user.subscription,
    //         //         usage: {
    //         //             ...user.subscription.usage,
    //         //             tailoredResumes: +1,
    //         //         },
    //         //     },
    //         // };
    
    //         // addNewResume(updatedUser);
    
    //         // await saveBaselineResume(updatedUser.id, {
    //         //     resume: updatedUser.resume,
    //         //     subscription: updatedUser.subscription,
    //         // });


    //     } catch (error) {
    //         console.error("Error generating tailored resume:", error);
    //         setError("Failed to generate tailored resume. Please try again.");
    //     }
    // };

    const generateCoverLetter = async (user,  newId, timeStamp) => {
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



// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';

// import { Button, Card, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { BsQuestionCircle } from 'react-icons/bs';

// import { useAuth } from '../../context/AuthContext';
// import { useUser } from '../../context/UserContext';

// import '../../views/main.css';

// export default function CreateCustomTailoredResume() {
//     const {
//         user,
//         setUser,
//         handleTailoredResumeChange,
//         sanitizeUserInput,
//         generateUUID,
//         setSuccessMessage,
//         setError,
//     } = useUser();

//     const { setLoading } = useAuth();
//     const history = useNavigate();

//     const companyNameTooltip = 'The name of the company you are applying for.';
//     const prospectiveJobDescTooltip = 'Copy/Paste a description of the role you are applying for.';

//     const handleSubmit = async () => {
//         const newId = generateUUID();
//         const timeStamp = new Date().toISOString();

//         if (!user.tailoredResume.companyName || !user.tailoredResume.description) {
//             setError('Company name and job description are required.');
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             const tailoredResumeData = await generateTailoredResume(user, newId, timeStamp);
//             const coverLetterData = await generateCoverLetter(user, newId, timeStamp);

//             const updatedUser = {
//                 ...user,
//                 resume: [
//                     ...user.resume,
//                     {
//                         ...tailoredResumeData,
//                         id: newId,
//                         usage: {
//                             timeStamp,
//                             tailoredResume: true,
//                         },
//                     },
//                 ],
//                 coverLetter: coverLetterData,
//                 subscription: {
//                     ...user.subscription,
//                     usage: {
//                         ...user.subscription.usage,
//                         tailoredResumes: (user.subscription.usage.tailoredResumes || 0) + 1,
//                     },
//                 },
//             };

//             setUser(updatedUser);
//             setSuccessMessage('Tailored Resume and Cover Letter created successfully!');
//             history('/Review');
//         } catch (error) {
//             console.error('Error during submission:', error);
//             setError('Failed to generate documents. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generateTailoredResume = async (user, newId, timeStamp) => {
//         try {
//             const response = await axios.post(
//                 'https://us-central1-resumancy.cloudfunctions.net/generate_tailored_resume-generate_tailored_resume',
//                 { user },
//                 { headers: { 'Content-Type': 'application/json' } }
//             );
    
//             // Destructure the relevant data from the response
//             const { summary, experienceSection, skillsSection, educationSection } = response.data;
    
//             let parsedExperience = [];
//             try {
//                 // Parse the experience data safely
//                 if (experienceSection?.data) {
//                     parsedExperience = JSON.parse(experienceSection.data);
//                 }
//             } catch (parseError) {
//                 console.error('Error parsing experience section:', parseError);
//                 setError('Failed to parse the experience section. Please try again.');
//                 throw parseError; // Exit early on parse failure
//             }
    
//             // Construct a new tailored resume object
//             const newResume = {
//                 id: newId,
//                 summary: summary?.data || '',
//                 experience: parsedExperience,
//                 skills: skillsSection?.data || [],
//                 education: educationSection?.data || [],
//                 usage: {
//                     timeStamp,
//                     baseResume: false,
//                 },
//             };
    
//             // Update the user state by appending the new resume
//             setUser((prevState) => ({
//                 ...prevState,
//                 resume: [...prevState.resume, newResume], // Append the new resume
//                 subscription: {
//                     ...prevState.subscription,
//                     usage: {
//                         ...prevState.subscription.usage,
//                         tailoredResumes: (prevState.subscription.usage?.tailoredResumes || 0) + 1,
//                     },
//                 },
//             }));
    
//             // Optionally save the new resume
//             // await saveBaselineResume(newId, {
//             //     resume: [...user.resume, newResume], // Save the updated resume array
//             //     subscription: {
//             //         ...user.subscription,
//             //         usage: {
//             //             ...user.subscription.usage,
//             //             tailoredResumes: (user.subscription.usage?.tailoredResumes || 0) + 1,
//             //         },
//             //     },
//             // });
    
//             console.log('Tailored resume generated successfully!');
//         } catch (error) {
//             console.error('Error generating tailored resume:', error);
    
//             if (error.response && error.response.data) {
//                 console.error('API error response:', error.response.data);
//             }
    
//             setError('Failed to generate tailored resume. Please try again.');
//             throw error; // Re-throw error for upstream handling
//         }
//     };

//     const generateCoverLetter = async (user, newId, timeStamp) => {
//         try {
//             const response = await axios.post(
//                 'https://us-central1-resumancy.cloudfunctions.net/generate_cover_letter-generate_cover_letter',
//                 { user },
//                 { headers: { 'Content-Type': 'application/json' } }
//             );

//             return {
//                 id: newId,
//                 createdAt: timeStamp,
//                 response: response.data.coverLetterSummary || '',
//             };
//         } catch (error) {
//             console.error('Error generating cover letter:', error);
//             setError('Failed to generate cover letter. Please try again.');
//             throw error;
//         }
//     };

//     return (
//         <>
//             <div className="pageWrapper">
//                 <h5>Tailor Your Resume To The Job</h5>
//                 <div className="secondaryPageWrapper">
//                     <div className="cardInnerDiv" id="jobDescriptionCardInnerDiv">
//                         <Card>
//                             <Card.Body className="cardBody">
//                                 <h4>
//                                     Prospective Company Name<span className="required-indicator">*</span>{' '}
//                                     <OverlayTrigger overlay={<Tooltip>{companyNameTooltip}</Tooltip>}>
//                                         <span className="question-icon">
//                                             <BsQuestionCircle />
//                                         </span>
//                                     </OverlayTrigger>
//                                 </h4>
//                                 <textarea
//                                     rows="1"
//                                     cols="75"
//                                     value={user.tailoredResume.companyName}
//                                     onChange={(e) =>
//                                         handleTailoredResumeChange(
//                                             'companyName',
//                                             sanitizeUserInput(e.target.value)
//                                         )
//                                     }
//                                     placeholder="Enter the prospective company name here..."
//                                     className="mobile-textarea"
//                                 />
//                                 <br />
//                                 <h4>
//                                     Prospective Job Description<span className="required-indicator">*</span>{' '}
//                                     <OverlayTrigger overlay={<Tooltip>{prospectiveJobDescTooltip}</Tooltip>}>
//                                         <span className="question-icon">
//                                             <BsQuestionCircle />
//                                         </span>
//                                     </OverlayTrigger>
//                                 </h4>
//                                 <textarea
//                                     rows="10"
//                                     cols="75"
//                                     value={user.tailoredResume.description}
//                                     onChange={(e) =>
//                                         handleTailoredResumeChange(
//                                             'description',
//                                             sanitizeUserInput(e.target.value)
//                                         )
//                                     }
//                                     placeholder="Enter the prospective job description here..."
//                                     className="mobile-textarea"
//                                 />
//                                 <br />
//                                 <p className="required-note">
//                                     Fields marked with <span className="required-indicator">*</span> are required.
//                                 </p>
//                             </Card.Body>
//                         </Card>
//                         <Button aria-label="submit button" onClick={handleSubmit}>
//                             Submit
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
