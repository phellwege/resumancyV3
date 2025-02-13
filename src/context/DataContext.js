import React, { useContext, useEffect, useState } from 'react';
import LoadingPage from '../components/loadingPage/LoadingPage';
import {db} from '../server/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { useAuth } from './AuthContext';
import { increment } from "firebase/firestore";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { 
        user, 
        setUser,
        setSuccessMessage,
        setError,
        initialUserState
    } = useUser();
    const {currentUser} = useAuth();

    const fetchUserData = (userId) => {
        if (!userId) return null;
    
        const userDocRef = doc(db, 'users', userId);
    
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setUser(userData);
            } else {
                console.warn(`User ${userId} not found.`);
            }
        });
    
        return unsubscribe;
    };
    
    
    
    const updateUserData = async (userId, updatedData) => {
        try {
            const userDocRef = doc(db, 'users', userId);
    
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) {
                console.error('User document does not exist');
                return;
            }
    
            const currentUserData = userDocSnap.data();

            const mergedData = {
                ...currentUserData,
                ...updatedData,
                contactInfo: {
                    ...currentUserData.contactInfo,
                    ...updatedData.contactInfo,
                },
                address: {
                    ...currentUserData.address,
                    ...updatedData.address,
                },
                resume: updatedData.resume ? [...currentUserData.resume, ...updatedData.resume] : currentUserData.resume,
                tailoredResume: updatedData.tailoredResume ? [...currentUserData.tailoredResume, ...updatedData.tailoredResume] : currentUserData.tailoredResume,
                coverLetter: updatedData.coverLetter ? [...currentUserData.coverLetter, ...updatedData.coverLetter] : currentUserData.coverLetter,
                subscription: {
                    ...currentUserData.subscription,
                    ...updatedData.subscription,
                    usage: {
                        ...currentUserData.subscription.usage,
                        ...updatedData.subscription?.usage,
                    },
                    limits: {
                        ...currentUserData.subscription.limits,
                        ...updatedData.subscription?.limits,
                    },
                },
            };
    
            await updateDoc(userDocRef, mergedData);
    
            setUser((prevUser) => ({
                ...prevUser,
                ...mergedData,
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
                await updateDoc(userDocRef, updatedData);
                setUser((prevUser) => ({
                    ...prevUser,
                    ...updatedData,
                }));
            } else {
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
    
            await updateDoc(userDocRef, {
                resume: arrayUnion(newResume),
                tailoredResume: arrayUnion(newTailoredEntry),
                "subscription.usage.tailoredResumes": increment(1),
            });
    
            setUser((prevUser) => ({
                ...prevUser,
                resume: [...prevUser.resume, newResume],
                tailoredResume: [
                    ...prevUser.tailoredResume.filter(tr => tr.id !== newTailoredEntry.id),
                    newTailoredEntry,
                ],
                subscription: {
                    ...prevUser.subscription,
                    usage: {
                        ...prevUser.subscription.usage,
                        tailoredResumes:  prevUser.subscription.usage.tailoredResumes + 1 + 1,
                    }
                }
            }));
    
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
            console.error('❌ Error fetching resumes:', error);
            return [];
        }
    };
    const fetchCoverLetters = async (userId) => {
        try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
    
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                return userData.coverLetter || [];
            } else {
                return [];
            }
        } catch (error) {
            console.error("❌ Error fetching cover letters:", error);
            return [];
        }
    };
    const updateSpecificResume = async (userId, updatedResume) => {
        try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
    
            if (!userDocSnap.exists()) {
                console.error("User document not found.");
                return;
            }
    
            const userData = userDocSnap.data();
            const updatedResumes = userData.resume.map(resume =>
                resume.id === updatedResume.id ? { ...resume, ...updatedResume } : resume
            );
    
            await updateDoc(userDocRef, { resume: updatedResumes });
    
            setSuccessMessage("✅ Resume successfully updated!");
        } catch (error) {
            console.error("❌ Error updating resume:", error);
        }
    };

    const updateSpecificCoverLetter = async (userId, updatedCoverLetter) => {
        try {
            const userDocRef = doc(db, "users", userId);
    
            const userSnapshot = await getDoc(userDocRef);
            if (!userSnapshot.exists()) throw new Error("User not found");
    
            const userData = userSnapshot.data();
    
            const updatedCoverLetters = userData.coverLetter.map(cl =>
                cl.id === updatedCoverLetter.id ? updatedCoverLetter : cl
            );
    
            await updateDoc(userDocRef, { coverLetter: updatedCoverLetters });
    
            setSuccessMessage("✅ Cover letter updated successfully in Firestore");
        } catch (error) {
            console.error("❌ Error updating cover letter:", error);
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
        if (loading || !currentUser || !user?.id) return;
    
        let unsubscribe;
        try {
            unsubscribe = fetchUserData(user.id);
        } catch (error) {
            console.error("❌ Error in Firestore listener: ", error);
        }
    
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [loading, currentUser, user?.id]);

    const [readyTailoredResume, setReadyTailoredResume] = useState([]);
    useEffect(() => {
        if (!user.id) return;

        const loadResumes = async () => {
            const userId = user.id;
            const fetchedResumes = await fetchResumes(userId);

            const filteredResumes = fetchedResumes.filter(resume => resume.usage?.baseResume === false);

            const mergedResumes = filteredResumes.map(resume => {
                const tailoredData = user.tailoredResume.find(tr => tr.id === resume.id);
                return {
                    ...resume,
                    companyName: tailoredData?.companyName || "Unknown",
                };
            });

            setReadyTailoredResume(mergedResumes);
        };

        loadResumes();
    }, [user.id, user.tailoredResume]); 

    const [readyBaseResume, setReadyBaseResume] = useState([])
    useEffect(() => {
        if (!user?.id) return;

        const loadResumes = async () => {
            const userId = user.id;
            const fetchedResumes = await fetchResumes(userId);

            const filteredResumes = fetchedResumes.filter(resume => resume.usage?.baseResume === true);

            setReadyBaseResume(filteredResumes);
        };

        loadResumes();
    }, [user.id, user.resume[0]]); 


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
        fetchCoverLetters,
        updateSpecificResume,
        updateSpecificCoverLetter,
        readyTailoredResume,
        readyBaseResume
    };

    return (
        <DataContext.Provider value={value}>
        {loading ? <LoadingPage /> : children}
        </DataContext.Provider>
    );
}
