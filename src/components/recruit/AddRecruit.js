import React from 'react';
import Button from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import AddressForm from '../user/AddressForm';
import { useUser } from '../../context/UserContext';

export default function AddRecruit() {
    const {
        recruit,
        handleRecruitChange,
        handleRecruitAddressChange,
        handleRecruitContactChange,
        handleRecruitResumeChange,
        handleRecruitTailoredResumeChange,
        handleRecruitCoverLetterChange,
        addRecruitToRecruiter,
        recruiter
    } = useUser()
  return (
    <>
        <h3>Add Recruit</h3>
        <Form>
            <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    value={recruit.firstName}
                    onChange={(e) => {handleRecruitChange('firstName', e.target.value)}}
                ></Form.Control>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    value={recruit.lastName}
                    onChange={(e) => {handleRecruitChange('lastName', e.target.value)}}
                ></Form.Control>
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Current Job Title"
                    value={recruit.jobTitle}
                    onChange={(e) => {handleRecruitChange('jobTitle', e.target.value)}}
                ></Form.Control>
            </Form.Group>
            <Form.Group>
                <h5>Contact Information</h5>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                    type="tel"
                    placeholder="(123) 456 - 7890"
                    value={recruit.contactInfo.phone}
                    onChange={(e) => {handleRecruitContactChange('phone', e.target.value)}}
                ></Form.Control>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Email"
                    value={recruit.contactInfo.email}
                    onChange={(e) => {handleRecruitContactChange('email', e.target.value)}}
                ></Form.Control>
                <Form.Label>Social Media Accounts</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Social Media Accounts"
                    value={recruit.contactInfo.socialMedia}
                    onChange={(e) => {handleRecruitContactChange('socialMedia', e.target.value)}}
                ></Form.Control>
            </Form.Group>
            <AddressForm onChange={handleRecruitAddressChange}/>
        </Form>
        
        <Button>Save</Button>
    </>
  )
}
