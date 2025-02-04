import React, {useState} from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaMinusSquare , FaPlusSquare, FaArrowCircleRight  } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";


import './main.css';

import { useUser } from '../context/UserContext';
// import StripePricingTable from '../components/StripePricingTable';
import { useData } from '../context/DataContext';

export default function InitialUserSetup() {
    const {
        user,
        handleUserChange,
        handleContactChange,
        sanitizeUserInput,
        addSocialMediaEntry,
        removeSocialMediaEntry,
        handleSocialMediaChange,
        setError,
        setSuccessMessage
    } = useUser();
    const {
        saveUserData
    } = useData();

    const userFirstName = "First Name (Required)";
    const userLastName = "Last Name (Required)";
    const userJobTitle = "Last Name (Required)";
    const userEmail = "Email Address (Required)";
    const userPhoneNumber = "Phone Number (Required)";
    const userSocialMediaAcct = "Social Media Accounts (Optional)";

    const validateForm = () => {
        const { firstName, lastName, jobTitle, contactInfo } = user;
        const { email, phone } = contactInfo;

        return (
            firstName.trim() &&
            lastName.trim() &&
            jobTitle.trim() &&
            email.trim() &&
            phone.trim()
        );
    };

    const handleContinue = async () => {
        if (validateForm()) {
            const updatedUserData = {
                firstName: user.firstName,
                lastName: user.lastName,
                jobTitle: user.jobTitle,
                contactInfo: {
                    email: user.contactInfo.email,
                    phone: user.contactInfo.phone,
                    socialMedia: user.contactInfo.socialMedia,
                },
                initialSetupDone: true
            };
    
            await saveUserData(user.id, updatedUserData);
    
        } else {
            setError('Please complete all required fields.');
        }
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
                formattedPhoneNumber += ` -${inputPhoneNumber.substring(6, 10)}`;
            }
        }
        return sanitizeUserInput(formattedPhoneNumber);
    };

  return (
    <>
    <Header />
    <div className='pageWrapper'>
        <div className='secondaryPageWrapper'>
            <div className='leftDiv'>
                <Card>
                    <Card.Body>
                        <div className='cardInnerDiv'>
                            <h4>Profile Setup</h4>
                            <sub>
                                This data is only used to autofill your resume.
                                <br/>
                                We don't sell your data.
                            </sub>
                            <Form>
                                <Form.Group>
                                    <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                        First Name<span className="required-indicator">*</span> {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userFirstName}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        <sub>({user.firstName.length} / 25)</sub>
                                    </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="First Name"
                                        value={user.firstName}
                                        onChange={(e) => {handleUserChange('firstName', e.target.value)}}
                                        className="mb-2"
                                        maxLength={25}
                                    />
                                    <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                        Last Name<span className="required-indicator">*</span> {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userLastName}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        <sub>({user.lastName.length} / 25)</sub>
                                    </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="Last Name"
                                        value={user.lastName}
                                        onChange={(e) => {handleUserChange('lastName', e.target.value)}}
                                        className="mb-2"
                                        maxLength={25}
                                    />
                                </Form.Group>
                                <Form.Group>
                                <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                        Job Title<span className="required-indicator">*</span> {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userJobTitle}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        <sub>({user.jobTitle.length} / 50)</sub>
                                    </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="Current Job Title"
                                        value={user.jobTitle}
                                        onChange={(e) => {handleUserChange('jobTitle', e.target.value)}}
                                        className="mb-2"
                                        maxLength={50}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                        Email<span className="required-indicator">*</span> {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userEmail}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        <sub>({user.contactInfo.email.length} / 75)</sub>
                                    </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="Email"
                                        value={user.contactInfo.email}
                                        onChange={(e) => {handleContactChange('email', e.target.value)}}
                                        className="mb-2"
                                        maxLength={75}
                                    />
                                </Form.Group>
                                <Form.Group>
                                <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                        Phone<span className="required-indicator">*</span> {" "}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userPhoneNumber}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                    </Form.Label>
                                    <Form.Control 
                                        type="tel"
                                        placeholder="(123) 456 - 7890"
                                        value={ user.contactInfo.phone }
                                        onChange={(e) => handleContactChange('phone', handlePhoneNumberChange(e))}
                                        className="mb-2"
                                    />
                                </Form.Group>
                                <Form.Group>
                                <Form.Label className="d-flex justify-content-between align-items-center">
                                        <div className='text-centered'>
                                        Social Media Accounts (Optional){' '}
                                            <OverlayTrigger 
                                                overlay={
                                                <Tooltip id="tooltip">
                                                    {userSocialMediaAcct}
                                                </Tooltip>
                                                }>
                                                <span className="question-icon">
                                                    <BsQuestionCircle />
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                    </Form.Label>
                                    {user.contactInfo.socialMedia.map((account, index) => (
                                        <div key={index} className="social-media-entry">
                                            <div className='userSetupModalSocialSquish'>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Platform (e.g., LinkedIn)"
                                                    value={account.name} // Correctly access the 'name' property
                                                    onChange={(e) => handleSocialMediaChange(index, 'name', sanitizeUserInput(e.target.value))}
                                                    className="mb-2"
                                                />
                                                <Form.Control
                                                    type="url"
                                                    placeholder="URL (e.g., https://linkedin.com/in/your-profile)"
                                                    value={account.url} // Correctly access the 'url' property
                                                    onChange={(e) => handleSocialMediaChange(index, 'url', sanitizeUserInput(e.target.value))}
                                                    className="mb-2"
                                                />    
                                            </div>
                                            <div className='createResumePlusAndMinus'>
                                                <FaPlusSquare 
                                                size={25}
                                                onClick={addSocialMediaEntry}
                                                id='CreateResumePlusButton'
                                                className='creationButton'
                                                >
                                                    Add Social Media
                                                </FaPlusSquare>
                                                <FaMinusSquare
                                                    size={25}
                                                    onClick={() => removeSocialMediaEntry(index)}
                                                    id='CreateResumeMinusButton'
                                                    className='creationButton'
                                                >
                                                    Remove
                                                </FaMinusSquare>
                                            </div>
                                        </div>
                                    ))}
                                </Form.Group>
                            </Form>
                        <Button onClick={handleContinue}>
                            Continue
                        </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </div>
    <Footer />
    </>
  )
}
