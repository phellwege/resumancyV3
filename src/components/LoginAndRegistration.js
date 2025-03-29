import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Alert, Button } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Logo from '../static/logo_monochrome.webp';
import UserSetupModal from './user/UserSetupModal';
import '../views/main.css';
import firebase from 'firebase/compat/app';

export default function LoginAndRegistration() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        initialUserState,
        loginModal,
        handleCloseLoginModal,
        setUser,
        setSuccessMessage,
        setError,
    } = useUser();
    const { setLoading, currentUser, emailVerified, sendVerificationEmail, sendEmailVerification } = useAuth();
    const [verificationSent, setVerificationSent] = useState(false);
    const [showVerificationAlert, setShowVerificationAlert] = useState(false);
    const [referralCode, setReferralCode] = useState('');

    const { 
        firebaseUiInstance 
    } = useAuth();
    const { 
        updateUserData, 
        addUserData, 
        checkUserExists, 
        fetchUserData,
        initializeUserReferral 
    } = useData();

    // Extract referral code from URL if present
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const ref = queryParams.get('ref');
        if (ref) {
            setReferralCode(ref);
            // Store in session storage in case the page refreshes
            sessionStorage.setItem('referralCode', ref);
        } else {
            // Check if we have a stored referral code
            const storedRef = sessionStorage.getItem('referralCode');
            if (storedRef) {
                setReferralCode(storedRef);
            }
        }
    }, [location]);

    const capitalizeEachWord = (text) => {
        return text
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const mergeWithInitialState = (fetchedUserData) => {
        return {
            ...initialUserState,
            ...fetchedUserData,
            contactInfo: {
                ...initialUserState.contactInfo,
                ...(fetchedUserData?.contactInfo || {}),
            },
            address: {
                ...initialUserState.address,
                ...(fetchedUserData?.address || {}),
            },
            resume: fetchedUserData?.resume?.length ? fetchedUserData.resume : initialUserState.resume,
            tailoredResume: fetchedUserData?.tailoredResume?.length ? fetchedUserData.tailoredResume : initialUserState.tailoredResume,
            coverLetter: fetchedUserData?.coverLetter?.length ? fetchedUserData.coverLetter : initialUserState.coverLetter,
            subscription: {
                ...initialUserState.subscription,
                ...(fetchedUserData?.subscription || {}),
            },
        };
    };

    const handleUserRegistrationOrLogin = async (authUser) => {
        setLoading(true);
        try {
            const capitalizedDisplayName = capitalizeEachWord(authUser.displayName || 'Guest');
            const [firstName, lastName = ''] = capitalizedDisplayName.split(' ');

            // Check if this is a new user
            const userExists = await checkUserExists(authUser.uid);
            
            // Check if user signed in with Google (Google accounts are pre-verified)
            const isGoogleSignIn = authUser.providerData && 
                authUser.providerData.some(provider => provider.providerId === 'google.com');

            if (!userExists) {
                // This is a new user registration
                let newUserData = {
                    ...initialUserState,
                    id: authUser.uid,
                    firstName,
                    lastName,
                    userName: capitalizedDisplayName,
                    contactInfo: {
                        ...initialUserState.contactInfo,
                        email: authUser.email,
                    },
                };

                // Create Stripe customer
                const response = await fetch("https://us-central1-resumancy.cloudfunctions.net/createStripeCustomer-createStripeCustomer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: authUser.email, firebaseUID: authUser.uid }),
                });

                const data = await response.json();
                if (data.stripeCustomerId) {
                    newUserData.stripeCustomerId = data.stripeCustomerId;
                }

                // Add user to database
                await addUserData(authUser.uid, newUserData);
                setUser(newUserData);
                
                // Initialize referral system and link to referrer if code exists
                if (referralCode) {
                    await initializeUserReferral(authUser.uid, referralCode);
                    // Clear the stored referral code
                    sessionStorage.removeItem('referralCode');
                } else {
                    // Initialize with just a referral code for this user
                    await initializeUserReferral(authUser.uid);
                }

                // Send verification email for new users with email/password sign-in
                if (!isGoogleSignIn && !authUser.emailVerified) {
                    try {
                        // Add a delay to ensure Firebase has fully registered the user
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // Force reload the user to ensure we have the latest auth state
                        await authUser.reload();
                        
                        // Send verification email using Firebase directly
                        const actionCodeSettings = {
                            // URL you want to redirect back to after email verification
                            url: `${window.location.origin}/verify-email?email=${authUser.email}`,
                            handleCodeInApp: true,
                        };
                        
                        // Send the verification email directly using the Firebase SDK
                        await sendEmailVerification(authUser, actionCodeSettings);
                        
                        setVerificationSent(true);
                        setShowVerificationAlert(true);
                        setSuccessMessage(
                            'Registration successful! ' + 
                            'A verification email has been sent to your inbox. ' +
                            'If you don\'t see it, please check your spam folder or use the "Resend Verification Email" button below.'
                        );
                    } catch (error) {
                        console.error("Error sending initial verification email:", error);
                        // Still show verification alert but with a message about using the resend button
                        setShowVerificationAlert(true);
                        setError("Registration successful, but we couldn't send the verification email. Please use the resend button.");
                    }
                } else {
                    // Google users can proceed directly to setup
                    setSuccessMessage('Registration successful! Redirecting to setup...');
                    navigate('/InitialUserSetup');
                }
            } else {
                // This is a returning user
                const fetchedUserData = await fetchUserData(authUser.uid);
                const mergedUserData = mergeWithInitialState(fetchedUserData);
                setUser(mergedUserData);

                if (!isGoogleSignIn && !authUser.emailVerified) {
                    // User hasn't verified their email yet
                    setShowVerificationAlert(true);
                } else {
                    setSuccessMessage(`Welcome back, ${firstName}!`);
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Error handling user registration or login:', error);
            setError('Failed to complete registration or login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerificationEmail = async () => {
        setLoading(true);
        try {
            // Add a delay to ensure Firebase has fully registered the user
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const result = await sendVerificationEmail();
            if (result.success) {
                setVerificationSent(true);
                setSuccessMessage(result.message);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            setError('Failed to send verification email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const uiConfig = {
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: true,
                },
                'google.com',
            ],
            tosUrl: '/TermsOfUse',
            privacyPolicyUrl: '/PrivacyPolicy',
            signInSuccessUrl: '/',
            callbacks: {
                signInSuccessWithAuthResult: (authResult) => {
                    handleUserRegistrationOrLogin(authResult.user);
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
            if (firebaseUiInstance) {
                firebaseUiInstance.reset();
            }
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
                        {showVerificationAlert && currentUser && !emailVerified && (
                            <Alert variant="warning" className="mb-3">
                                <Alert.Heading>Email Verification Required</Alert.Heading>
                                <p>
                                    Please verify your email address to access all features. 
                                    We've sent a verification link to <strong>{currentUser.email}</strong>.
                                </p>
                                <p>
                                    Check your inbox (and spam folder) and click the verification link.
                                    Once verified, you can proceed with using the application.
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button 
                                        variant="outline-warning" 
                                        onClick={handleSendVerificationEmail}
                                        disabled={verificationSent}
                                    >
                                        {verificationSent ? "Verification Email Sent" : "Resend Verification Email"}
                                    </Button>
                                </div>
                            </Alert>
                        )}
                        <>
                            <div className='loginModalLogo'>
                                <img src={Logo} alt='Resumancy Logo' />
                            </div>
                            <div id="firebaseui-login-container"></div>
                        </>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
