import React, { useEffect, useState } from 'react';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function FinishSignIn() {
  const navigate = useNavigate();
  const { setUser, setSuccessMessage, setError } = useUser();
  const { checkUserExists, addUserData, fetchUserData } = useData();
  const {setLoading} = useAuth()
  const auth = getAuth();

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        if (!email) {
          setError('No email provided. Cannot complete sign-in.');
          setLoading(false);
          return;
        }
  
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          setError('Invalid sign-in link.');
          setLoading(false);
          return;
        }
  
        const userCredential = await signInWithEmailLink(auth, email, window.location.href);
        console.log("User Credential:", userCredential);
        const user = userCredential.user;
        // window.localStorage.removeItem('emailForSignIn');
        setUser(user);
        navigate('/InitialUserSetup')

      } catch (error) {
        console.error('Error finishing sign-in:', error);
        setError('There was a problem completing sign-in. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    completeSignIn();
  }, [auth, checkUserExists, addUserData, fetchUserData, setUser, setSuccessMessage, setError]);
  

  return <>HUH</>;
}
