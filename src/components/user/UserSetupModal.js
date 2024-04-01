import React, {useRef} from 'react'
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import SelectAvatarModal from './SelectAvatarModal';
import '../../views/main.css';

export default function UserSetupModal() {
    const {
        user,
        setupUserModal,
        handleCloseSetupUserModal,
        handleUserChange,
        handleContactChange,
        handleOpenSelectAvatar
    } = useUser();
    
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
        <Modal.Header closeButton>
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
                            <Form.Control 
                                as="textarea"
                                placeholder="Enter Social Media Accounts"
                                value={user.contactInfo.socialMedia}
                                onChange={(e) => handleContactChange('socialMedia', e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </div>
                <div className='loginModalLogo'>
                  <p>
                    This is only used to populate Resumes, 
                    <br/>
                    We don't sell your information.
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
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="danger" onClick={handleCloseSetupUserModal}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleCloseSetupUserModal}>
                Save
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
