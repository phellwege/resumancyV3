import React from 'react';
import { Form, Button } from 'react-bootstrap'
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
        handleProjectChange,
        addProjectEntry,
        removeProjectEntry,
        handleContactChange,
        handleUserChange,
        handleCustomSectionNameChange,
        handleCustomSectionEntryChange,
        addCustomSection,
        removeCustomSection,
        addCustomSectionEntry,
        removeCustomSectionEntry,
        selectedResume
    } = useUser();

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
    
    const handlePhoneNumberChange = (e) => {
        const inputPhoneNumber = e.target.value.replace(/\D/g, '');
        let formattedPhoneNumber = '';
        if (inputPhoneNumber.length > 0) {
            formattedPhoneNumber += `(${inputPhoneNumber.substring(0, 3)})`;
            if (inputPhoneNumber.length >= 4) {
                formattedPhoneNumber += ` ${inputPhoneNumber.substring(3, 6)}`;
            }
            if (inputPhoneNumber.length >= 7) {
                formattedPhoneNumber += ` - ${inputPhoneNumber.substring(6, 10)}`;
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
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label style={{marginBottom: 0, fontWeight: 'bold'}}>
                        Experience
                    </Form.Label>
                    <div>
                        <FaPlusSquare onClick={addExperienceEntry} size={25} className='creationButton mr-2' id='AddExperience'/>
                    </div>
                </div>
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
                        <div className='text-right'>
                            <FaMinusSquare onClick={() => removeExperienceEntry(index)} size={22} className='creationButton' id={`RemoveExperience-${index}`}/>
                        </div>
                    </div>
                ))}
                {(selectedResume.customSections || []).map((section, sectionIndex) => (
                    <div key={`section-${sectionIndex}`} className="custom-section mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Control
                                type='text'
                                placeholder='Section Name'
                                value={section.sectionName}
                                onChange={(e) => handleCustomSectionNameChange(sectionIndex, sanitizeUserInput(e.target.value))}
                                className="section-name-input"
                                style={{width: '70%', fontWeight: 'bold'}}
                            />
                            <div>
                                <FaPlusSquare onClick={() => addCustomSectionEntry(sectionIndex)} size={25} className='creationButton mr-2' id={`AddEntry-${sectionIndex}`}/>
                                <FaMinusSquare onClick={() => removeCustomSection(sectionIndex)} size={25} className='creationButton' id={`RemoveSection-${sectionIndex}`}/>
                            </div>
                        </div>
                        
                        {(section.entries || []).map((entry, entryIndex) => (
                            <div key={`entry-${sectionIndex}-${entryIndex}`} className="custom-section-entry" style={{border: '1px solid lightblue', padding: '10px', margin: '5px 0', borderRadius: '.5REM'}}>
                                <Form.Control 
                                    type='text'
                                    placeholder='Title'
                                    value={entry.title}
                                    onChange={(e) => handleCustomSectionEntryChange(sectionIndex, entryIndex, 'title', sanitizeUserInput(e.target.value))}
                                    className="mb-2"
                                />
                                <Form.Group className="d-flex gap-3 align-items-center">
                                    <Form.Control 
                                        type='text'
                                        placeholder='Subtitle'
                                        value={entry.subtitle || ''}
                                        onChange={(e) => handleCustomSectionEntryChange(sectionIndex, entryIndex, 'subtitle', sanitizeUserInput(e.target.value))}
                                        className="mb-2"
                                    />
                                    <Form.Control 
                                        type='text'
                                        placeholder='Time Frame'
                                        value={entry.timeframe}
                                        onChange={(e) => handleCustomSectionEntryChange(sectionIndex, entryIndex, 'timeframe', sanitizeUserInput(e.target.value))}
                                        className="mb-2"
                                    />
                                </Form.Group>
                                <Form.Control 
                                    as='textarea'
                                    rows={3}
                                    placeholder='Description'
                                    value={entry.description}
                                    onChange={(e) => handleCustomSectionEntryChange(sectionIndex, entryIndex, 'description', sanitizeUserInput(e.target.value))}
                                    className="mb-2"
                                />
                                <div className='text-right'>
                                    <FaMinusSquare onClick={() => removeCustomSectionEntry(sectionIndex, entryIndex)} size={22} className='creationButton' id={`RemoveEntry-${sectionIndex}-${entryIndex}`}/>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                
                {/* Different button style when no custom sections exist */}
                {(!selectedResume.customSections || selectedResume.customSections.length === 0) ? (
                    <div className="text-center mb-4 mt-2">
                        <Button
                            variant="primary"
                            onClick={addCustomSection}
                            className="w-75 py-2"
                        >
                            <strong>+ Add Custom Section</strong>
                        </Button>
                        <p className="text-muted mt-2 small">Add projects, certifications, or any other section you need</p>
                    </div>
                ) : (
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={addCustomSection}
                        className="mb-3"
                    >
                        + Add New Section
                    </Button>
                )}
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