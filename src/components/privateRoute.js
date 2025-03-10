import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { Button } from 'react-bootstrap';

export default function PrivateRoute({ children }) {
  const { user, setError, setSuccessMessage } = useUser();
  const { currentUser, emailVerified, sendVerificationEmail } = useAuth();
  const [redirectPath, setRedirectPath] = useState(null);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    // Optionally wait for a "loaded" flag if available in your user state.
    if (!user?.id) return; // user not loaded yet

    // Check if email is verified or if user signed in with Google
    const isGoogleSignIn = currentUser?.providerData && 
      currentUser.providerData.some(provider => provider.providerId === 'google.com');
    
    // Only require email verification for email/password sign-in
    if (currentUser && !emailVerified && !isGoogleSignIn) {
      setShowVerificationAlert(true);
      setError("Please verify your email address to access this page.");
      return;
    }

    if (user?.id && !user?.initialSetupDone) {
      setError("Please complete your initial setup before proceeding.");
      setRedirectPath("/InitialUserSetup");
    } else if (user?.id && user?.initialSetupDone && !user?.subscription.active) {
      setError("Your subscription is inactive. Please choose a plan to continue.");
      setRedirectPath("/Subscribe");
    } else {
      setRedirectPath(null);
    }
  }, [user, setError, currentUser, emailVerified]);

  const handleSendVerificationEmail = async () => {
    try {
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
    }
  };

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  if (showVerificationAlert) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Email Verification Required</h4>
            <p className="card-text">
              Please verify your email address to access this page. 
              We've sent a verification link to <strong>{currentUser?.email}</strong>.
            </p>
            <p className="card-text">
              Check your inbox (and spam folder) and click the verification link.
              Once verified, you can proceed with using the application.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-warning" 
                onClick={handleSendVerificationEmail}
                disabled={verificationSent}
                className="me-2"
              >
                {verificationSent ? "Verification Email Sent" : "Resend Verification Email"}
              </Button>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                I've Verified My Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
