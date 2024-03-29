import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import AddressForm from '../user/AddressForm';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function AddRecruit() {
    const {
        recruit,
        generateUUID,
        handleRecruitChange,
        handleRecruitAddressChange,
        handleRecruitContactChange,
        handleRecruitResumeChange,
        handleRecruitTailoredResumeChange,
        handleRecruitCoverLetterChange,
        addRecruitToRecruiter,
        recruiter
    } = useUser();
    const history = useNavigate()
    const [includeAddress, setIncludeAddress] = useState(null)
    const handleSaveRecruitToRecruiter = () => {
        handleRecruitChange('id', generateUUID())
        const completedRecruit = { ...recruit };
        if (!includeAddress) {
            completedRecruit.address.street = null;
            completedRecruit.address.appt = null;
            completedRecruit.address.city = null;
            completedRecruit.address.state = null;
            completedRecruit.address.zip = null;
        }
        addRecruitToRecruiter(completedRecruit);
        // resetRecruitForm();
    };
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

    // const resetRecruitForm = () => {
    //     setRecruit({
    //         id: null,
    //         timeStamp: null,
    //         firstName: '',
    //         lastName: '',
    //         jobTitle: '',
    //         industry: null,
    //         contactInfo: {
    //             phone: '',
    //             email: '',
    //             socialMedia: []
    //         },
    //         address: includeAddress ? { street: null, appt: null, city: null, state: null, zip: null } : null,
    //         resume: {
    //             experience: null,
    //             education: null,
    //             skills: null,
    //             additional: null,
    //             summary: null,
    //             timeStamp: null
    //         },
    //         tailoredResume: {
    //             id: null,
    //             companyName: null,
    //             experience: null,
    //             education: null,
    //             skills: null,
    //             additional: null,
    //             summary: null,
    //             timeStamp: null,
    //         },
    //         coverLetter: {
    //             id: null,
    //             companyName: null,
    //             data: null,
    //             timeStamp: null
    //         },
    //     });
    // };
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
                    onChange={(e) => {handleRecruitContactChange('phone', handlePhoneNumberChange(e))}}
                ></Form.Control>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={recruit.contactInfo.email}
                    onChange={(e) => {handleRecruitContactChange('email', e.target.value)}}
                ></Form.Control>
                <Form.Label>Social Media Accounts</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Social Media Accounts"
                    value={recruit.contactInfo.socialMedia}
                    onChange={(e) => {handleRecruitContactChange('socialMedia', e.target.value)}}
                ></Form.Control>
            </Form.Group>
            <Form.Group>
                {/* <AddressForm onChange={handleRecruitAddressChange}/> */}
                <Form.Label>Want to include Their address?</Form.Label>
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
                        <AddressForm onChange={handleRecruitAddressChange}/>
                    </div>
                )}
            </Form.Group>
        </Form>
        <br/>
        <Button onClick={()=>{
            handleSaveRecruitToRecruiter();
            history('/RecruiterMainPage')
            }}
        >
            Save
        </Button>
    </>
  )
}
