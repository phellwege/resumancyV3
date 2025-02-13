import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Logo from '../static/logo_monochrome.png';
import UserSetupModal from './user/UserSetupModal';
import '../views/main.css';
import firebase from 'firebase/compat/app';

export default function LoginAndRegistration() {
    const navigate = useNavigate();
    const {
        initialUserState,
        loginModal,
        handleCloseLoginModal,
        setUser,
        setSuccessMessage,
        setError,
    } = useUser();
    const {setLoading} = useAuth();

    const { firebaseUiInstance } = useAuth();
    const { updateUserData, addUserData, checkUserExists, fetchUserData } = useData();


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

            const userExists = await checkUserExists(authUser.uid);

            if (!userExists) {
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

                const response = await fetch("https://us-central1-resumancy.cloudfunctions.net/createStripeCustomer-createStripeCustomer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: authUser.email, firebaseUID: authUser.uid }),
                });

                const data = await response.json();
                if (data.stripeCustomerId) {
                    newUserData.stripeCustomerId = data.stripeCustomerId;
                }

                await addUserData(authUser.uid, newUserData);
                setUser(newUserData);

                setSuccessMessage('Registration successful! Redirecting to setup...');
                navigate('/InitialUserSetup');
            } else {
                const fetchedUserData = await fetchUserData(authUser.uid);
                const mergedUserData = mergeWithInitialState(fetchedUserData);
                setUser(mergedUserData);

                setSuccessMessage(`Welcome back, ${firstName}!`);
            }
        } catch (error) {
            console.error('Error handling user registration or login:', error);
            setError('Failed to complete registration or login. Please try again.');
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
                        <>
                            <div className="loginModalForm">
                                <div id="firebaseui-login-container"></div>
                            </div>
                            <div className="loginModalLogo">
                                <img src={Logo} alt="Resumancy main logo" />
                            </div>
                        </>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
