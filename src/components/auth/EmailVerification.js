import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { applyActionCode, getAuth } from 'firebase/auth';
import '../../views/main.css';

export default function EmailVerification() {
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const { currentUser, emailVerified, setEmailVerified } = useAuth();
    const { setSuccessMessage, setError } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();

    useEffect(() => {
        // Extract action code from URL
        const queryParams = new URLSearchParams(location.search);
        const mode = queryParams.get('mode');
        const oobCode = queryParams.get('oobCode');
        const email = queryParams.get('email');
        
        // Check if we have the verification code
        if (oobCode) {
            handleVerification(oobCode);
        } else if (email) {
            // If we have email but no code, show a message about checking email
            setVerificationResult({
                success: true,
                message: "Please check your email for a verification link. If you don't see it, check your spam folder or use the resend button."
            });
        }
    }, [location]);

    const handleVerification = async (oobCode) => {
        setVerifying(true);
        try {
            // Try direct verification with Firebase
            await applyActionCode(auth, oobCode);
            
            // If user is logged in, refresh their status
            if (currentUser) {
                await currentUser.reload();
                const isVerified = currentUser.emailVerified;
                setEmailVerified(isVerified);
            }
            
            setVerificationResult({
                success: true,
                message: "Email verified successfully!"
            });
            
            setSuccessMessage("Email verified successfully!");
        } catch (error) {
            console.error("Verification error:", error);
            setVerificationResult({
                success: false,
                message: error.message || 'Verification failed. The link may be invalid or expired.'
            });
            setError(error.message || 'Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleContinue = () => {
        if (currentUser) {
            // If user is already logged in, redirect to initial setup or home
            if (emailVerified) {
                navigate('/InitialUserSetup');
            } else {
                navigate('/');
            }
        } else {
            // If no user is logged in, redirect to login
            navigate('/');
        }
    };

    return (
        <>
            <Header />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
                <Card className="w-100" style={{ maxWidth: "500px" }}>
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Email Verification</Card.Title>
                        
                        {verifying ? (
                            <div className="text-center my-4">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Verifying...</span>
                                </Spinner>
                                <p className="mt-3">Verifying your email address...</p>
                            </div>
                        ) : verificationResult ? (
                            <div className="text-center mt-4">
                                <p>{verificationResult.message}</p>
                                <Button variant="primary" onClick={handleContinue} className="mt-3">
                                    Continue to {currentUser ? (emailVerified ? "Setup" : "Home") : "Login"}
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p>No verification code found. If you clicked on a verification link, it may be invalid or expired.</p>
                                <Button variant="primary" onClick={() => navigate('/')} className="mt-3">
                                    Return to Home
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
}
