import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import AddressForm from '../user/AddressForm';

export default function EditRecruit({ recruit }) {
    const {
        editRecruit,
        editRecruitContact,
        editRecruitAddress
    } = useUser();
    const [includeAddress, setIncludeAddress] = useState(null);

    const handlePhoneNumberChange = (e) => {
        const inputPhoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
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
        return formattedPhoneNumber;
    };

    const handleRecruitChange = (key, value) => {
        editRecruit(recruit.id, { [key]: value });
    };

    const handleRecruitContactChange = (key, value) => {
        editRecruitContact(recruit.id, { [key]: value });
    };

    const handleRecruitAddressChange = (key, value) => {
        editRecruitAddress(recruit.id, { [key]: value });
    };

    return (
        <>
            <h3>Edit Recruit</h3>
            <Form>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter First Name"
                        value={recruit.firstName}
                        onChange={(e) => { handleRecruitChange('firstName', e.target.value) }}
                    ></Form.Control>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Last Name"
                        value={recruit.lastName}
                        onChange={(e) => { handleRecruitChange('lastName', e.target.value) }}
                    ></Form.Control>
                    <Form.Label>Job Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Current Job Title"
                        value={recruit.jobTitle}
                        onChange={(e) => { handleRecruitChange('jobTitle', e.target.value) }}
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <h5>Contact Information</h5>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="(123) 456 - 7890"
                        value={recruit.contactInfo.phone}
                        onChange={(e) => { handleRecruitContactChange('phone', handlePhoneNumberChange(e)) }}
                    ></Form.Control>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={recruit.contactInfo.email}
                        onChange={(e) => { handleRecruitContactChange('email', e.target.value) }}
                    ></Form.Control>
                    <Form.Label>Social Media Accounts</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Social Media Accounts"
                        value={recruit.contactInfo.socialMedia}
                        onChange={(e) => { handleRecruitContactChange('socialMedia', e.target.value) }}
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Want to include Their address?</Form.Label>
                    <br />
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
                                <br />
                                Feel free to fill out only the fields you wish to provide.
                            </sub>
                            <AddressForm onChange={handleRecruitAddressChange} />
                        </div>
                    )}
                </Form.Group>
            </Form>
        </>
    );
}
