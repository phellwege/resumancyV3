import React, {useState, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form, Alert } from 'react-bootstrap';
import { useUser } from '../context/UserContext';

import '../views/main.css';
import Logo from '../static/logo_monochrome.png'
import UserSetupModal from './user/UserSetupModal';
import { useAuth } from '../context/AuthContext';
export default function LoginAndRegistration() {
    const history = useNavigate();
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
    const {
        register,
        login,
        resetPassword,
        setLoading
    } = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const loginEmailRef = useRef();
    const loginPasswordRef = useRef();
    const [error, setError] = useState('');
    const validatePassword = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(passwordRef.current.value);
    };
    async function handleRegistrationRequest(e) {
            e.preventDefault();
            if(passwordRef.current.value !== passwordConfirmRef.current.value){
                return setError('Passwords do not match');
            }
            if (!validatePassword()) {
                return setError('Password must have at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.');
            }
            try {
                setError('')
                setLoading(true)
                const userCred = await register(emailRef.current.value, passwordRef.current.value);
                const userId = userCred.user.uid;
                handleUserChange('id', userId);
                handleCloseRegisterModal(); 
                handleOpenSetupUserModal()
            } 
            catch(err) {
                setError('Failed to create account ' + err)
            } finally {
                setLoading(false);
            }
        }
    async function handleLoginRequest(e) {
            e.preventDefault();
            try {
                setError('')
                setLoading(true)
                await login(loginEmailRef.current.value, loginPasswordRef.current.value);
                handleCloseRegisterModal(); 
                history('/')
            } 
            catch(err) {
                setError('Failed to create account ' + err)
            } finally {
                setLoading(false);
            }
        }
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
                                ref={loginEmailRef}
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
                            ref={loginPasswordRef}
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
            <Button 
            variant="secondary" 
            onClick={
                handleCloseLoginModal
                }
            >
                Close
            </Button>
            <Button 
            variant="primary" 
            onClick={(e) => {
                handleCloseLoginModal()
                }}
            >
                Continue
            </Button>
        </Modal.Footer>
    </Modal>

    {error && (
            <Alert variant='danger' className='alerts' id='registrationError' dismissible>
                <Alert.Heading>
                    Error
                </Alert.Heading>
                {error}
            </Alert>
        )}

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
                                ref={emailRef}
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
                            ref={passwordRef}
                            />
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                            type="password" 
                            placeholder="Confirm Password" 
                            ref={passwordConfirmRef}
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
                    <sub>Need To Register a Business Account Instead?</sub>
                    <Link 
                    to='' 
                    onClick={() =>{
                        handleCloseRegisterModal(); 
                        handleOpenBusinessRegModal()
                        }}
                    >
                        Business Registration
                    </Link>
                </div>
                <div className='modalFooterRight'>
                    <Button 
                    variant="secondary" 
                    onClick={
                        handleCloseRegisterModal
                        }
                    >
                        Close
                    </Button>
                    <Button 
                    variant="primary" 
                    onClick={(e) => {
                        handleRegistrationRequest(e);
                        }}
                    >
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
