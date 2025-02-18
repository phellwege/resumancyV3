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
        if (!isSignInWithEmailLink(auth, email, window.location.href)) {
          setError('Invalid sign-in link.');
          setLoading(false);
          return;
        }

        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        if (!email) {
          setError('No email provided. Cannot complete sign-in.');
          setLoading(false);
          return;
        }

        // ✅ Wait for the sign-in to complete
        const userCredential = await signInWithEmailLink(auth, email, window.location.href);
        console.log("User Credential:", userCredential);
        window.localStorage.removeItem('emailForSignIn');

        // ✅ Wait for Firebase Auth state to update before continuing
        const waitForAuthState = new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log("Auth state updated: User is signed in", user);
              unsubscribe();
              resolve(user);
            }
          });
        });

        const user = await waitForAuthState;

        // ✅ Check if the user exists in Firestore
        const userExists = await checkUserExists(user.uid);
        if (!userExists) {
          const newUserData = {
            id: user.uid,
            contactInfo: { email: user.email },
            createdAt: new Date(),
          };
          await addUserData(user.uid, newUserData);
          setUser(newUserData);
          setSuccessMessage('Registration successful! Redirecting to setup...');
          // navigate('/InitialUserSetup');
        } else {
          const existingData = await fetchUserData(user.uid);
          setUser(existingData);
          setSuccessMessage('Welcome back!');
          // navigate('/');
        }
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
