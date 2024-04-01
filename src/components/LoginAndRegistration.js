import React from 'react'
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { useUser } from '../context/UserContext';

import '../views/main.css';
import Logo from '../static/logo_monochrome.png'
import UserSetupModal from './user/UserSetupModal';
export default function LoginAndRegistration() {
    const {
        registerModal,
        loginModal,
        handleCloseLoginModal,
        handleOpenLoginModal,
        handleOpenSetupUserModal,
        handleCloseRegisterModal,
        handleOpenRegisterModal,
        handleOpenBusinessRegModal,

        handleContactChange,
        handleUserChange,
        user
    } = useUser()
    
  return (
    <>
    <UserSetupModal />
    <Modal 
    show={loginModal} 
    onHide={handleCloseLoginModal}
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
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                autoComplete='email'
                                type="email"
                                placeholder="Enter email"
                                value={user.contactInfo.email}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                            autoComplete='current-password'
                            type="password" 
                            placeholder="Password" 
                            />
                        </Form.Group>
                        <Link to=''>Forgot Password</Link>
                    </Form>
                </div>
                <div className='loginModalLogo'>
                    <img src={Logo} alt='resumancy main logo'/>
                    <div className='modalChangeLoginOrRegister'>
                        <sub>Create an Account?</sub>
                        <Link 
                        to=''
                        onClick={() => {
                            handleCloseLoginModal(); 
                            handleOpenRegisterModal()
                        }}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseLoginModal}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {handleCloseLoginModal()}}>
                Continue
            </Button>
        </Modal.Footer>
    </Modal>

    <Modal 
    show={registerModal} 
    onHide={handleCloseRegisterModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton>
            <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='modalBodyWrap'>
                <div className='loginModalForm'>
                    <Form>
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
                                <Form.Label>
                                    Create Username
                                </Form.Label>
                                <Form.Control
                                type='text'
                                placeholder='Enter Username'
                                value={user.userName}
                                onChange={(e) => handleUserChange('userName', e.target.value)}
                                />
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
                    </Form>
                </div>
                <div className='loginModalLogo'>
                    <img src={Logo} alt='resumancy main logo'/>
                    <div className='modalChangeLoginOrRegister'>
                        <sub>Already Have An Account?</sub>
                        <Link 
                        to=''
                        onClick={() => {
                            handleCloseRegisterModal(); 
                            handleOpenLoginModal()
                        }}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
        <div className='modalFooterWrap'>
                <div className='modalFooterLeft'>
                    <sub>Need To Register a Recruiter Account Instead?</sub>
                    <Link 
                    to='' 
                    onClick={() =>{
                        handleCloseRegisterModal(); 
                        handleOpenBusinessRegModal()
                        }}
                    >
                        Recruiter Registration
                    </Link>
                </div>
                <div className='modalFooterRight'>
                    <Button variant="secondary" onClick={handleCloseRegisterModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {handleCloseRegisterModal(); handleOpenSetupUserModal()}}>
                        Next
                    </Button>
                </div>
            </div>
            <div className='modalFooterWrap'>
                
            </div>
        </Modal.Footer>
    </Modal>
    </>
  )
}
