import React from 'react';
import { Form } from 'react-bootstrap'
import { useUser } from '../../context/UserContext';

import DOMPurify from 'dompurify';

import '../../views/main.css';

export default function EditResume() {
    const {
        user,
        handleResumeChange,
        handleUserChange,
        handleContactChange
    } = useUser();

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    return (
        <>
        <div className='cardInnerDiv'>
            <Form.Group>
                <Form.Label>
                    First Name
                </Form.Label>
                <Form.Control 
                type='text' 
                placeholder='first name'
                value={capitalizeFirstLetter(user.firstName)}
                onChange={(e) => handleUserChange('firstName', e.target.value)}
                maxLength='50'
                />
                <Form.Label>
                    Last Name
                </Form.Label>
                <Form.Control 
                type='text' 
                placeholder='Last name'
                value={capitalizeFirstLetter(user.lastName)}
                onChange={(e) => handleUserChange('lastName', e.target.value)}
                maxLength='50'
                />
                <Form.Label>
                    Job Title
                </Form.Label>
                <Form.Control 
                type='text' 
                placeholder='Job Title'
                value={user.jobTitle}
                onChange={(e) => handleUserChange('jobTitle', e.target.value)}
                maxLength='50'
                />
                <Form.Label>
                    Contact Info
                </Form.Label>
                <Form.Control 
                as='textarea'
                rows={3}
                placeholder='Contact Info'
                value={user.contactInfo.phoneNumber}
                onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
                maxLength='500'
                />
                <Form.Label>
                    Summary
                </Form.Label>
                <Form.Control 
                as='textarea'
                rows={3}
                placeholder='Summary'
                value={user.resume.summary || ''}
                onChange={(e) => handleResumeChange('summary', e.target.value)}
                maxLength='1000'
                />
                <Form.Label>
                    Experience
                </Form.Label>
                <Form.Control 
                as='textarea'
                rows={5}
                placeholder='Experience'
                value={user.resume.experience}
                onChange={(e) => handleResumeChange('experience', e.target.value)}
                maxLength='2000'
                />
                <Form.Label>
                    Education
                </Form.Label>
                <Form.Control 
                as='textarea'
                rows={3}
                placeholder='Education'
                value={user.resume.education}
                onChange={(e) => handleResumeChange('education', e.target.value)}
                maxLength='500'
                />
                <Form.Label>
                    Skills
                </Form.Label>
                <Form.Control 
                as='textarea'
                rows={5}
                placeholder='Skills'
                value={user.resume.skills}
                onChange={(e) => handleResumeChange('skills', e.target.value)}
                maxLength='500'
                />
            </Form.Group>
        </div>
        </>
    )
}