import React, {useState} from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaMinusSquare , FaPlusSquare, FaArrowCircleRight  } from "react-icons/fa";

import './main.css';

import { useUser } from '../context/UserContext';
import StripePricingTable from '../components/StripePricingTable';

export default function InitialUserSetup() {
    const {
        user,
        handleUserChange,
        handleContactChange,
        sanitizeUserInput,
        addSocialMediaEntry,
        removeSocialMediaEntry,
        handleSocialMediaChange,
        isTableEnabled,
        setIsTableEnabled
    } = useUser();

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

    const handleContinue = () => {
        if (validateForm()) {
            setIsTableEnabled(true);
        } else {
            alert('Please complete all required fields.');
        }
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Complete the form to continue
        </Tooltip>
    );
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
                            <h5>Finish setting up your profile</h5>
                            <Form>
                                <Form.Group className="d-flex gap-3 align-items-center">
                                    <Form.Control 
                                        type="text"
                                        placeholder="First Name"
                                        value={user.firstName}
                                        onChange={(e) => {handleUserChange('firstName', e.target.value)}}
                                        className="mb-2"
                                    />
                                    <Form.Control 
                                        type="text"
                                        placeholder="Last Name"
                                        value={user.lastName}
                                        onChange={(e) => {handleUserChange('lastName', e.target.value)}}
                                        className="mb-2"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Job Title</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="Current Job Title"
                                        value={user.jobTitle}
                                        onChange={(e) => {handleUserChange('jobTitle', e.target.value)}}
                                        className="mb-2"
                                    />
                                </Form.Group>
                                <Form.Group  className="d-flex gap-3 align-items-center">
                                    <Form.Control 
                                        type="text"
                                        placeholder="Email"
                                        value={user.contactInfo.email}
                                        onChange={(e) => {handleContactChange('email', e.target.value)}}
                                        className="mb-2"
                                    />
                                    <Form.Control 
                                        type="tel"
                                        placeholder="(123) 456 - 7890"
                                        value={ user.contactInfo.phone }
                                        onChange={(e) => handleContactChange('phone', handlePhoneNumberChange(e))}
                                        className="mb-2"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Social Media Accounts (optional)</Form.Label>
                                    {user.contactInfo.socialMedia.map((account, index) => (
                                        <div key={index} className="social-media-entry">
                                            {/* Field for Social Media Platform Name */}
                                            <div className='userSetupModalSocialSquish'>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Platform (e.g., LinkedIn)"
                                                    value={account.name} // Correctly access the 'name' property
                                                    onChange={(e) => handleSocialMediaChange(index, 'name', sanitizeUserInput(e.target.value))}
                                                    className="mb-2"
                                                />
                                                {/* Field for Social Media URL */}
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
            <div className='initSetupArrow'>
            <FaArrowCircleRight size={50} color='#9cb9da'/>
            <br/>
            <p>Get started your free 7 day trial, or select a plan to continue.</p>
            </div>
            <div className='rightDiv'>
                <Card>
                    <Card.Body>
                    <div className="cardInnerDiv position-relative">
                        {!isTableEnabled && (
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                                <div className="disabled-overlay"></div>
                            </OverlayTrigger>
                        )}
                        <StripePricingTable />
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
