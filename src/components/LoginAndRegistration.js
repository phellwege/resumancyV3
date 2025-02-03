import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Logo from '../static/logo_monochrome.png';
import UserSetupModal from './user/UserSetupModal';
import '../views/main.css';
import firebase from 'firebase/compat/app';

export default function LoginAndRegistration() {
    const history = useNavigate();
    const {
        user,
        initialUserState,
        loginModal,
        handleCloseLoginModal,
        handleUserChange,
        handleContactChange,
        setSuccessMessage,
        setError,
    } = useUser();
    const { 
        firebaseUiInstance,
        currentUser,
    } = useAuth();
    const { 
        updateUserData,
        addUserData,
        checkUserExists
    } = useData();

    // Capitalizes each word in a string
    const capitalizeEachWord = (text) => {
        return text
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // ✅ **Moved `handleUserRegistrationOrLogin` OUTSIDE of useEffect**
    const handleUserRegistrationOrLogin = async (user, firstName, lastName, displayName) => {
        try {
            const newUserData = {
                ...initialUserState,
                id: user.uid,
                firstName,
                lastName,
                userName: displayName,
                contactInfo: {
                    ...initialUserState.contactInfo,
                    email: user.email,
                },
            };

            const userExists = await checkUserExists(user.uid);
            
            if (!userExists) {
                // **STEP 1: Create Stripe Customer**
                const response = await fetch("https://us-central1-your-project-id.cloudfunctions.net/createStripeCustomer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.email, firebaseUID: user.uid }),
                });

                const data = await response.json();

                if (data.stripeCustomerId) {
                    // **STEP 2: Store Stripe Customer ID in Firestore**
                    newUserData.stripeCustomerId = data.stripeCustomerId;
                }

                // **STEP 3: Save New User Data in Firestore**
                await addUserData(user.uid, newUserData);
                setSuccessMessage('Registration successful! Redirecting to setup...');
                history('/InitialUserSetup');
            } else {
                setSuccessMessage(`Welcome back, ${firstName}!`);
            }
        } catch (error) {
            console.error('Error handling user registration or login:', error);
            setError('Failed to complete registration or login. Please try again.');
        }
    };

    useEffect(() => {
        const uiConfig = {
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: true
                }, 
                'google.com'
            ],
            tosUrl: '/TermsOfUse',
            privacyPolicyUrl: '/PrivacyPolicy',
            signInSuccessUrl: '/',
            callbacks: {
                signInSuccessWithAuthResult: (authResult) => {
                    const user = authResult.user;
                    const capitalizedDisplayName = capitalizeEachWord(user.displayName);
                    const nameParts = capitalizedDisplayName.split(' ');
                    const firstName = nameParts[0] || 'Guest';
                    const lastName = nameParts[1] || '';

                    handleUserChange('id', user.uid); 
                    handleUserChange('userName', capitalizedDisplayName || 'Guest'); 
                    handleContactChange('email', user.email); 
                    handleUserChange('firstName', firstName);
                    handleUserChange('lastName', lastName);
                    
                    handleUserRegistrationOrLogin(user, firstName, lastName, capitalizedDisplayName);
                    
                    handleCloseLoginModal();
                    return false;
                },
            },
        };

        if (loginModal) {
            uiConfig.signInFlow = 'popup';
            firebaseUiInstance.start('#firebaseui-login-container', uiConfig);
        } 
        
        return () => {
            firebaseUiInstance.reset();
        };
    }, [loginModal]);

    return (
        <>
        <UserSetupModal />
        <Modal show={loginModal} onHide={handleCloseLoginModal} size="lg" centered>
            <Modal.Header closeButton closeVariant='white'>
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
        </>
    );
}
