import React, {useRef} from 'react'
// import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { useData } from '../../context/DataContext';
import { useUser } from '../../context/UserContext';
import SelectAvatarModal from './SelectAvatarModal';
import { FaMinusSquare , FaPlusSquare  } from "react-icons/fa";

import AddressForm from './AddressForm';

import '../../views/main.css';

export default function UserSetupModal() {
    const {
        user,
        setupUserModal,
        handleCloseSetupUserModal,
        handleUserChange,
        handleContactChange,
        handleOpenSelectAvatar,
        sanitizeUserInput,
        addSocialMediaEntry,
        removeSocialMediaEntry,
        handleSocialMediaChange,
        setSuccessMessage,
        handleAddressChange
    } = useUser();
    const {
        updateUserData
    } = useData();

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
    
    const handleSaveUser = async () => {
        const userId = user.id;
        const hasAddress = Object.values(user.address).some(value => value.trim() !== '');

        const updatedUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            jobTitle: user.jobTitle,
            contactInfo: {
                phone: user.contactInfo.phone,
                email: user.contactInfo.email,
                socialMedia: user.contactInfo.socialMedia,
            },
            avatarImg: user.avatarImg,
            ...(hasAddress && { address: { ...user.address } })
        };

        await updateUserData(userId, updatedUser);
        handleCloseSetupUserModal();
        setSuccessMessage("✅ Profile successfully updated!");
    };


  return (
    <>
    <SelectAvatarModal />
    <Modal 
    show={setupUserModal} 
    onHide={handleCloseSetupUserModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton  closeVariant='white'>
            <Modal.Title>Setup Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='modalBodyWrap' id='setupModal'>
                <div className='loginModalForm'>
                    <Form>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Enter First Name"
                                value={user.firstName}
                                onChange={(e) => {handleUserChange('firstName', e.target.value)}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Enter Last Name"
                                value={user.lastName}
                                onChange={(e) => {handleUserChange('lastName', e.target.value)}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Job Title</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Enter Current Job Title"
                                value={user.jobTitle}
                                onChange={(e) => {handleUserChange('jobTitle', e.target.value)}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>email</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="EnterEmail"
                                value={user.contactInfo.email}
                                onChange={(e) => {handleContactChange('email', e.target.value)}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control 
                                type="tel"
                                placeholder="(123) 456 - 7890"
                                value={ user.contactInfo.phone }
                                onChange={(e) => handleContactChange('phone', handlePhoneNumberChange(e))}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Social Media Accounts</Form.Label>
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
                                            value={account.url}
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
                </div>
                <div className='loginModalLogo'>
                    <p>
                        This data is only used to populate Resumes, 
                        we don't sell your information.
                    </p>
                    <div className='setupAvatarDiv'>
                        <img src={user.avatarImg} alt='user avatar image'/>
                        <Button 
                        onClick={()=> {
                            handleCloseSetupUserModal(); 
                            handleOpenSelectAvatar()
                        }}
                        >
                        Change Avatar
                        </Button>
                    </div>
                    <br/>
                    <div>
                        <AddressForm onChange={handleAddressChange}/>
                    </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={handleSaveUser}>
                Save
            </Button>
            <Button variant="danger" onClick={handleCloseSetupUserModal}>
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
