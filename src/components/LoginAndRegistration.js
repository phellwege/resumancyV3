import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';

import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

import '../views/main.css';
import Logo from '../static/logo_monochrome.png';
import UserSetupModal from './user/UserSetupModal';

export default function LoginAndRegistration() {
    const history = useNavigate();
    const {
        registerModal,
        loginModal,
        handleCloseLoginModal,
        handleUserChange
    } = useUser();
    const { 
        firebaseUiInstance,
        currentUser
    } = useAuth();

    const [error, setError] = useState('');

    useEffect(() => {
        const uiConfig = {
            signInOptions: ['password', 'google.com'],
            tosUrl: '/TermsOfUse',
            privacyPolicyUrl: '/PrivacyPolicy',
            signInSuccessUrl: '/',
            callbacks: {
                signInSuccessWithAuthResult: (authResult) => {
                    const user = authResult.user;
                    
                    // Update user state using handleUserChange
                    handleUserChange('id', user.uid); 
                    handleUserChange('userName', user.displayName || 'Guest'); 
                    handleUserChange('email', user.email); 
                    // handleUserChange('avatarImg', user.photoURL || ''); // Set avatar image (if available)
                    
                    // Optionally, set a default displayName if it's not set
                    if (!user.displayName) {
                        user.updateProfile({
                            displayName: 'Guest',
                        }).then(() => {
                            console.log('Display name set to Guest');
                        }).catch((error) => {
                            console.error('Error setting display name: ', error);
                        });
                    }
    
                    handleCloseLoginModal();
                    return false;
                },
            },
        };
        
        if (loginModal) {
            uiConfig.signInFlow = 'popup';
        } else if (registerModal) {
            uiConfig.signInFlow = 'popup';
            uiConfig.callbacks.uiShown = () => {
                firebaseUiInstance.setConfig({ initialScreen: 'signUp' });
            };
        }
        
        if (loginModal) {
            firebaseUiInstance.start('#firebaseui-login-container', uiConfig);
        } else if (registerModal) {
            firebaseUiInstance.start('#firebaseui-register-container', uiConfig);
        }
        
        return () => {
            firebaseUiInstance.reset();
        };
    }, [loginModal, registerModal]);

    return (
        <>
        <UserSetupModal />
        <Modal show={loginModal} onHide={handleCloseLoginModal} size="lg" centered>
            <Modal.Header closeButton>
            <Modal.Title>Login / Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="modalBodyWrap">
                <div className="loginModalForm">
                <div id="firebaseui-login-container"></div>
                </div>
                <div className="loginModalLogo">
                <img src={Logo} alt="resumancy main logo" />
                </div>
            </div>
            </Modal.Body>
        </Modal>

        {error && (
            <Alert variant="danger" className="alerts" id="registrationError" dismissible>
            <Alert.Heading>Error</Alert.Heading>
            {error}
            </Alert>
        )}

        </>
    );
}
