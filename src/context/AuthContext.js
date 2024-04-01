// handles login, registration, and subscription
import React, {useContext, useEffect, useState} from 'react';
import {db, auth, storage} from '../server/firebaseConfig';
import LoadingPage from '../components/loadingPage/LoadingPage';

import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail
} from 'firebase/auth';

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    query,
    where,
    updateDoc,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';

import { 
    getStorage, 
    ref, 
    uploadBytes,
    listAll,
    getDownloadURL
} from "firebase/storage";

const AuthContext = React.createContext()
export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(false);

    function register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    };
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    };
    function logout() {
        return auth.signOut();
    }
    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }
    

    // const fetchSubscription = async () => {
    //     if (currentUser && !loading) {
    //         try {
    //             const docRef = doc(db, 'userSubscription', `${currentUser.uid}`);
    //             const fetchedDoc = await getDoc(docRef);
    //             const docSnapshot = fetchedDoc.data()
    //             if (docSnapshot) {
    //                 const subscriptionData = docSnapshot.defaultSubscription;
    //                 if (subscriptionData) {
    //                     setDefaultSubscription(subscriptionData);
    //                 }
    //             }
                
    //         } catch (err) {
    //             setError('There was an error fetching the subscription: ' + err);
    //         }
    //     }
    // };

    // const handleUserSub = async () => {
    //     if (currentUser) {
    //     try { 
    //         const res = await setDoc(doc(db, 'userSubscription', `${currentUser.uid}`), {
    //             defaultSubscription: defaultSubscription
    //     })
    //     }
    //     catch(error) {
    //         setError('there was an error adding getting the default subscription ' + error)
    //     }}
    // };
    // const handleRecruiterSub = async () => {
    //     if (currentUser) {
    //     try { 
    //         const res = await setDoc(doc(db, 'recruiterSubscription', `${currentUser.uid}`), {
    //             defaultSubscription: defaultSubscription
    //     })
    //     }
    //     catch(error) {
    //         setError('there was an error adding getting the default subscription ' + error)
    //     }}
    // };

    // useEffect(() => {
    //     if (currentUser && !loading){
    //         fetchSubscription();
    //         fetchBaseDataHierarchy();
    //     }
    // }, [currentUser, loading]);

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(user => {
    //         setCurrentUser(user)
    //         setLoading(false)
    //     })
    //     return unsubscribe
    // }, []);


    const value = {
        register,
        login,
        logout,
        resetPassword,
        loading, setLoading,
    }
    
    return (
        <AuthContext.Provider value={value}>
            {loading ? <LoadingPage/> : children}
        </AuthContext.Provider>
    )
}