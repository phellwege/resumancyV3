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
import { useLocation } from 'react-router-dom';

const AuthContext = React.createContext();

let firebaseUiInstance;

// Token refresh interval in milliseconds (15 minutes)
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const location = useLocation();
    const isHomePage = location.pathname === "/" || location.pathname === "";
    
    // Initialize loading to false for home page, true for other pages
    const [loading, setLoading] = useState(!isHomePage);
    const [currentUser, setCurrentUser] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const { setUser, initialUserState } = useUser();
    const [successMessage, setSuccessMessage] = useState(null);

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
        let refreshTokenTimer = null;
        const unsubscribeTokenChanges = onIdTokenChanged(auth, async (user) => {
            // Clear any existing refresh timer
            if (refreshTokenTimer) {
                clearTimeout(refreshTokenTimer);
                refreshTokenTimer = null;
            }

            if (user) {
                // Get the token when it changes
                const token = await user.getIdToken();
                // You can store the token in localStorage if needed
                localStorage.setItem('authToken', token);

                // Set up a timer to refresh the token before it expires
                refreshTokenTimer = setTimeout(async () => {
                    try {
                        // Force token refresh
                        const newToken = await user.getIdToken(true);
                        localStorage.setItem('authToken', newToken);
                    } catch (error) {
                        // Clear token if user is signed out
                        localStorage.removeItem('authToken');
                    }
                }, TOKEN_REFRESH_INTERVAL);
            } else {
                // Clear token if user is signed out
                localStorage.removeItem('authToken');
            }
        });

        return () => {
            unsubscribeAuthState();
            unsubscribeTokenChanges();
            if (refreshTokenTimer) {
                clearTimeout(refreshTokenTimer);
            }
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
                // Clear token if user is signed out
                localStorage.removeItem('authToken');
            });
    }
    
    // Send email verification to the current user
    async function sendVerificationEmail(user = null) {
        // Use the provided user or fall back to currentUser
        const userToVerify = user || currentUser;
        
        if (userToVerify && !userToVerify.emailVerified) {
            try {
                const actionCodeSettings = {
                    url: `${window.location.origin}/verify-email?email=${userToVerify.email}`,
                    handleCodeInApp: true,
                };
                
                await sendEmailVerification(userToVerify, actionCodeSettings);
                
                return { success: true, message: "Verification email sent successfully! Please check your inbox and spam folder." };
            } catch (error) {
                return { success: false, message: "Error sending verification email" };
            }
        }
        return { success: false, message: "User is already verified" };
    }

    // Verify email with action code (from email link)
    const verifyEmail = async (actionCode) => {
        setLoading(true);
        try {
            await applyActionCode(auth, actionCode);
            
            // Refresh the user to get updated email verification status
            if (currentUser) {
                await currentUser.reload();
                const updatedVerificationStatus = currentUser.emailVerified;
                setEmailVerified(updatedVerificationStatus);
            }
            setLoading(false);
            return { success: true, message: "Email verified successfully!" };
        } catch (error) {
            setLoading(false);
            return { success: false, message: "Error verifying email" };
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
        successMessage,
        setSuccessMessage,
        sendEmailVerification,
        firebaseUiInstance,
    };

    return (
        <AuthContext.Provider value={value}>
        {loading ? <LoadingPage /> : children}
        </AuthContext.Provider>
    );
}
