import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';

import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext'; // Updated to use firebaseUiInstance from AuthContext

import '../views/main.css';
import Logo from '../static/logo_monochrome.png';
import UserSetupModal from './user/UserSetupModal';

export default function LoginAndRegistration() {
    const history = useNavigate();
    const {
        registerModal,
        loginModal,
        handleCloseLoginModal,
    } = useUser();
    const { 
        firebaseUiInstance 
    } = useAuth();

    const [error, setError] = useState('');

    useEffect(() => {
        const uiConfig = {
            signInOptions: ['password', 'google.com'],
            tosUrl: '/terms-of-service',
            privacyPolicyUrl: '/privacy-policy',
            signInSuccessUrl: '/',
            callbacks: {
                signInSuccessWithAuthResult: (authResult) => {
                    const user = authResult.user;
                    if (user.displayName) {
                        console.log('User displayName:', user.displayName);
                        } else {
                            console.log('Display name not set.');
                        }
                
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
