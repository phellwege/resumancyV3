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
                ></Form.Control>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    value={recruit.lastName}
                ></Form.Control>
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Current Job Title"
                    value={recruit.jobTitle}
                ></Form.Control>
            </Form.Group>
            <Form.Group>
                <h5>Contact Information</h5>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="(123) 456 - 7890"
                    value={recruit.contactInfo.phone}
                ></Form.Control>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Email"
                    value={recruit.contactInfo.email}
                ></Form.Control>
                <Form.Label>Social Media Accounts</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Social Media Accounts"
                    value={recruit.contactInfo.socialMedia}
                ></Form.Control>
            </Form.Group>
            <AddressForm />
        </Form>
        
        <Button>Submit</Button>
    </>
  )
}
