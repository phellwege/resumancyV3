import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../server/firebaseConfig';
import LoadingPage from '../components/loadingPage/LoadingPage';
import { onAuthStateChanged } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { useUser } from './UserContext';

const AuthContext = React.createContext();

let firebaseUiInstance;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const { setUser, initialUserState } = useUser();

    useEffect(() => {
        if (!firebaseUiInstance) {
        firebaseUiInstance = new firebaseui.auth.AuthUI(auth);
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
        });

        return unsubscribe;
    }, []);

     function logout() {
        return auth.signOut(auth)
            .then(() => {
                setCurrentUser(null);
                setUser(initialUserState);
                if (firebaseUiInstance) {
                    firebaseUiInstance.reset();
                }
            })
            .catch((error) => {
                console.error('Sign out error: ', error);
            });
    }
    
    const value = {
        currentUser,
        logout,
        loading,
        setLoading,
        firebaseUiInstance,
    };

    return (
        <AuthContext.Provider value={value}>
        {loading ? <LoadingPage /> : children}
        </AuthContext.Provider>
    );
}
