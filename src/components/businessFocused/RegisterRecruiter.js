import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';

import '../views/main.css';
import Logo from '../static/logo_monochrome.png';
import { useUser } from '../../context/UserContext';

export default function RegisterBusinessAcct() {
    const {
        businessRegistrationModal,
        handleCloseBusinessRegModal,
        recruiter,
        user,
        handleUserChange,
        handleContactChange,
        handleChangeRecruiter,
    } = useUser()
    const history = useNavigate();
  return (
    <>
    <Modal 
    show={businessRegistrationModal} 
    onHide={handleCloseBusinessRegModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='modalBodyWrap'>
                <div className='loginModalForm'>
                    <Form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Enter Username"
                                value={user.userName}
                                onChange={(e) => handleUserChange('userName', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email"
                                placeholder="Enter email"
                                value={user.contactInfo.email}
                                onChange={(e) => handleContactChange('email', e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                            type="password" 
                            placeholder="Enter Password" 
                            />
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                            type="password" 
                            placeholder="Confirm Password" 
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Please select your monthly recruitment volume</Form.Label>
                                <select 
                                className="form-control" 
                                id="exampleFormControlSelect1" 
                                onChange={(e) => handleChangeRecruiter('recruitTier', e.target.value)} 
                                value={recruiter.recruitTier}>
                                    <option value={1}>Low (1-10 recruits)</option>
                                    <option value={2}>Moderate (11-50 recruits)</option>
                                    <option value={3}>High (51+ recruits)</option>
                                </select>
                        </Form.Group>
                    </Form>
                </div>
                <div className='loginModalLogo'>
                    <img src={Logo} alt='resumancy main logo'/>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button 
            variant="secondary" 
            onClick={
                handleCloseBusinessRegModal
                }
            >
                Close
            </Button>
            <Button 
            variant="primary" 
            onClick={() => {
                handleCloseBusinessRegModal(); 
                handleUserChange('recruiter', true);
                history('/RecruiterSetupPage')
                }}
            >
                Next
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
