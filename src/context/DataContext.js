import React, { useContext, useEffect, useState } from 'react';
import LoadingPage from '../components/loadingPage/LoadingPage';
import {db, auth, storage} from '../server/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

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
    arrayUnion,
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

const DataContext = React.createContext();


export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { 
        user, 
        setUser 
    } = useUser();

    const fetchUserData = async (userId) => {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
            setUser(docSnap.data());
            } else {
            console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    
    const updateUserData = async (userId, updatedData) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, updatedData);
            setUser((prevUser) => ({
            ...prevUser,
            ...updatedData,
            }));
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const checkUserExists = async (userId) => {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        return userDocSnap.exists();
    };
    const addUserData = async (userId, newUserData) => {
        try {
            const userExists = await checkUserExists(userId);

            if (!userExists) {
                const userDocRef = doc(db, 'users', userId);
                await setDoc(userDocRef, newUserData);
                console.log('User data added to Firestore:', newUserData);
            } else {
                console.log('User already exists, skipping data addition.');
            }
        } catch (error) {
            console.error('Error adding user data:', error);
        }
    };
    const saveUserData = async (userId, updatedData) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
                // If the user exists, update their existing data
                await updateDoc(userDocRef, updatedData);
                setUser((prevUser) => ({
                    ...prevUser,
                    ...updatedData,
                }));
            } else {
                // If the user doesn't exist, create a new document
                await setDoc(userDocRef, {
                    ...updatedData,
                    createdAt: serverTimestamp(),
                });
                setUser((prevUser) => ({
                    ...prevUser,
                    ...updatedData,
                }));
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };
    const addTailoredResume = async (userId, newResume, newTailoredEntry) => {
        try {
            const userDocRef = doc(db, "users", userId);
    
            // 🔹 Save the tailored resume inside the resume array (not tailoredResume)
            await updateDoc(userDocRef, {
                resume: arrayUnion(newResume),
                tailoredResume: arrayUnion(newTailoredEntry),
            });
    
            // 🔹 THEN update local state
            setUser((prevUser) => ({
                ...prevUser,
                resume: [...prevUser.resume, newResume],
                tailoredResume: [
                    ...prevUser.tailoredResume.filter(tr => tr.id !== newTailoredEntry.id),
                    newTailoredEntry,
                ],
            }));
    
            console.log("Tailored resume successfully saved to Firestore!");
    
        } catch (error) {
            console.error("Error adding tailored resume:", error);
        }
    };
    
    const addCoverLetter = async (userId, newCoverLetter) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, {
                coverLetter: arrayUnion(newCoverLetter),
            });
            setUser((prevUser) => ({
                ...prevUser,
                coverLetter: [...prevUser.coverLetter, newCoverLetter],
            }));
            } catch (error) {
            console.error('Error adding cover letter:', error);
        }
    };
    const saveBaselineResume = async (userId, fieldsToUpdate) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, fieldsToUpdate);
            return { status: 200 };
        } catch (error) {
            console.error('Error saving baseline resume:', error);
            return { status: 500, message: error.message };
        }
    };
    
    const fetchResumes = async (userId) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);
    
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                return userData.resume || [];
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching resumes:', error);
            return [];
        }
    };
      // Upload file to Firebase Storage (e.g., avatar or resume)
    // const uploadFile = async (file, folderPath) => {
    //     const storageRef = ref(storage, `${folderPath}/${file.name}`);
    //     try {
    //         await uploadBytes(storageRef, file);
    //         const downloadURL = await getDownloadURL(storageRef);
    //         return downloadURL;
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //         return null;
    //     }
    // };
    
    useEffect(() => {
        if (user.id) {
            fetchUserData(user.id);
        }
    }, [user.id]);

    const value = {
        loading,
        setLoading,
        fetchUserData,
        updateUserData,
        // uploadFile,
        addTailoredResume,
        addCoverLetter,
        addUserData,
        checkUserExists,
        saveUserData,
        saveBaselineResume,
        fetchResumes,
    };

    return (
        <DataContext.Provider value={value}>
        {loading ? <LoadingPage /> : children}
        </DataContext.Provider>
    );
}
