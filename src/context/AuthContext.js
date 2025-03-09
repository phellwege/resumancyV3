import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../server/firebaseConfig';
import LoadingPage from '../components/loadingPage/LoadingPage';
import { 
    onAuthStateChanged, 
    onIdTokenChanged, 
    sendEmailVerification,
    applyActionCode
} from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { useUser } from './UserContext';

const AuthContext = React.createContext();

let firebaseUiInstance;

// Token refresh interval in milliseconds (15 minutes)
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const { setUser, initialUserState } = useUser();

    useEffect(() => {
        if (!firebaseUiInstance) {
        firebaseUiInstance = new firebaseui.auth.AuthUI(auth);
        }

        // Listen for auth state changes
        const unsubscribeAuthState = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                setEmailVerified(user.emailVerified);
            }
            setLoading(false);
        });

        // Listen for ID token changes
        const unsubscribeTokenChanges = onIdTokenChanged(auth, async (user) => {
            if (user) {
                // Get the token when it changes
                const token = await user.getIdToken();
                // You can store the token in localStorage if needed
                localStorage.setItem('authToken', token);
                
                // Set up a timer to refresh the token before it expires
                const refreshTokenTimer = setTimeout(async () => {
                    try {
                        // Force token refresh
                        const newToken = await user.getIdToken(true);
                        localStorage.setItem('authToken', newToken);
                    } catch (error) {
                        console.error('Error refreshing token:', error);
                    }
                }, TOKEN_REFRESH_INTERVAL);
                
                return () => clearTimeout(refreshTokenTimer);
            } else {
                // Clear token if user is signed out
                localStorage.removeItem('authToken');
            }
        });

        return () => {
            unsubscribeAuthState();
            unsubscribeTokenChanges();
        };
    }, []);

     function logout() {
        return auth.signOut(auth)
            .then(() => {
                setCurrentUser(null);
                setEmailVerified(false);
                localStorage.removeItem("user");
                localStorage.removeItem("authToken");
                setUser(initialUserState);
                if (firebaseUiInstance) {
                    firebaseUiInstance.reset();
                }
            })
            .catch((error) => {
                console.error('Sign out error: ', error);
            });
    }
    
    // Send email verification to the current user
    async function sendVerificationEmail(user = null) {
        // Use the provided user or fall back to currentUser
        const userToVerify = user || currentUser;
        
        if (userToVerify && !userToVerify.emailVerified) {
            try {
                console.log("Attempting to send verification email to:", userToVerify.email);
                
                // Configure actionCodeSettings for the verification email
                const actionCodeSettings = {
                    // URL you want to redirect back to after email verification
                    url: `${window.location.origin}/verify-email?email=${userToVerify.email}`,
                    // This must be true for email verification
                    handleCodeInApp: true,
                };
                
                await sendEmailVerification(userToVerify, actionCodeSettings);
                console.log("Verification email sent successfully");
                return { success: true, message: "Verification email sent successfully! Please check your inbox and spam folder." };
            } catch (error) {
                console.error("Error sending verification email:", error);
                return { success: false, message: error.message };
            }
        }
        return { success: false, message: "No user is logged in or email is already verified." };
    }

    // Verify email with action code (from email link)
    async function verifyEmail(actionCode) {
        try {
            console.log("AuthContext: Verifying email with action code:", actionCode);
            await applyActionCode(auth, actionCode);
            
            if (currentUser) {
                // Force refresh the user to update emailVerified status
                console.log("AuthContext: Refreshing user to update verified status");
                await currentUser.reload();
                const updatedVerificationStatus = currentUser.emailVerified;
                console.log("AuthContext: Updated email verified status:", updatedVerificationStatus);
                setEmailVerified(updatedVerificationStatus);
                return { success: true, message: "Email verified successfully!" };
            }
            return { success: true, message: "Email verified. Please sign in again." };
        } catch (error) {
            console.error("Error verifying email:", error);
            return { success: false, message: error.message };
        }
    }
    
    const value = {
        currentUser,
        logout,
        loading,
        setLoading,
        emailVerified,
        setEmailVerified,
        sendVerificationEmail,
        verifyEmail,
        sendEmailVerification,
        firebaseUiInstance,
    };

    return (
        <AuthContext.Provider value={value}>
        {loading ? <LoadingPage /> : children}
        </AuthContext.Provider>
    );
}
