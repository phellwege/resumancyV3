import React from 'react';
import { Form } from 'react-bootstrap'
import { useUser } from '../../context/UserContext';
import { FaMinusSquare , FaPlusSquare  } from "react-icons/fa";

import '../../views/main.css';

export default function EditResume() {
    const {
        user, 
        setUser,
        handleResumeChange,
        sanitizeUserInput,
        handleAddressChange,
        handleExperienceChange,
        addExperienceEntry,
        removeExperienceEntry,
        handleContactChange,
        handleUserChange,
        selectedResume
    } = useUser();

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
    console.log("Selected Resume:", selectedResume);
    console.log("Experience:", selectedResume?.experience);
    
    const handlePhoneNumberChange = (e) => {
        const inputPhoneNumber = e.target.value.replace(/\D/g, '');
        let formattedPhoneNumber = '';
        if (inputPhoneNumber.length > 0) {
            formattedPhoneNumber += `(${inputPhoneNumber.substring(0, 3)})`;
            if (inputPhoneNumber.length >= 4) {
                formattedPhoneNumber += ` ${inputPhoneNumber.substring(3, 6)}`;
            }
            if (inputPhoneNumber.length >= 7) {
                formattedPhoneNumber += ` -${inputPhoneNumber.substring(6, 10)}`;
            }
        }
        return sanitizeUserInput(formattedPhoneNumber);
    };
    return (
        <>
        <div className='cardInnerDiv'>
            <Form.Group className="d-flex gap-3 align-items-center">
                <Form.Control 
                type='text' 
                placeholder='first name'
                value={capitalizeFirstLetter(user.firstName)}
                onChange={(e) => handleUserChange('firstName', sanitizeUserInput(e.target.value))}
                maxLength='50'
                aria-label="Small"
                className="mb-2"
                />
                <Form.Control 
                type='text' 
                placeholder='Last name'
                value={capitalizeFirstLetter(user.lastName)}
                onChange={(e) => handleUserChange('lastName', sanitizeUserInput(e.target.value))}
                maxLength='50'
                aria-label="Small"
                className="mb-2"
                />
            </Form.Group>
            <Form.Group  className="d-flex gap-3 align-items-center">
                <Form.Control 
                type='text'
                placeholder='Phone Number'
                value={user.contactInfo.phone}
                onChange={(e) => handleContactChange('phone', handlePhoneNumberChange(e))}
                maxLength='500'
                aria-label="Small"
                className="mb-2"
                />
                <Form.Control 
                type='text'
                placeholder='Email'
                value={user.contactInfo.email}
                onChange={(e) => handleContactChange('email', sanitizeUserInput(e.target.value))}
                maxLength='500'
                aria-label="Small"
                className="mb-2"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    Summary
                </Form.Label>
                <Form.Control 
                as='textarea'
                rows={3}
                placeholder='Summary'
                value={selectedResume.summary || ''}
                onChange={(e) => handleResumeChange('summary', sanitizeUserInput(e.target.value))}
                maxLength='1000'
                className="mb-2"
                />
                <Form.Label>
                    Experience
                </Form.Label>
                {selectedResume.experience.map((exp, index) => (
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
                <Form.Label>
                    Education
                </Form.Label>
                <Form.Control 
                as='textarea'
                rows={3}
                placeholder='Education'
                value={selectedResume.education}
                onChange={(e) => handleResumeChange('education', sanitizeUserInput(e.target.value))}
                maxLength='500'
                />
                <Form.Label>
                    Skills
                </Form.Label>
                <Form.Control 
                as='textarea'
                rows={3}
                placeholder='Skills'
                value={selectedResume.skills}
                onChange={(e) => handleResumeChange('skills', sanitizeUserInput(e.target.value))}
                maxLength='1000'
                />
            </Form.Group>
        </div>
        </>
    )
}