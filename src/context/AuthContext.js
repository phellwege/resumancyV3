import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../server/firebaseConfig';
import LoadingPage from '../components/loadingPage/LoadingPage';
import { onAuthStateChanged } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

const AuthContext = React.createContext();

let firebaseUiInstance; // Singleton instance

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!firebaseUiInstance) {
      firebaseUiInstance = new firebaseui.auth.AuthUI(auth); // Create only if it doesn't exist
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function logout() {
    return auth.signOut();
  }

  const value = {
    currentUser,
    logout,
    loading,
    firebaseUiInstance,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}
