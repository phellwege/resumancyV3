import React, {useContext, useEffect, useMemo, useState} from 'react';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';

const BusinessContext = React.createContext()

export function useBusiness(){
    return useContext(BusinessContext)
}

export function BusinessProvider({ children }) {
    const [businessRegistrationModal, setBusinessRegistrationModal] = useState(false);
    const handleOpenBusinessRegModal = () => setBusinessRegistrationModal(true);
    const handleCloseBusinessRegModal = () => setBusinessRegistrationModal(false);
    
    const [selectRecruiterAvatar, setSelectRecruiterAvatar] = useState(false);
    const handleOpenSelectRecruiterAvatar = () => setSelectRecruiterAvatar(true);
    const handleCloseSelectRecruiterAvatar = () => setSelectRecruiterAvatar(false);

    // recruiter tiers are as follow:
    // <option value={1}>Casual Recruiters (1-10 recruits per month)</option>
    // <option value={2}>Moderate Recruiters (11-50 recruits per month)</option>
    // <option value={3}>High-Volume Recruiters (51+ recruits per month)</option>
    // pricing is adjusted as follows
    // 1 price is 25.00 / mo
    // 2 price is 50.00 / mo
    // 3 price is 250.00 / mo
    const [recruiter, setRecruiter] = useState({
        userId: user.id,
        recruitTier: 0,
        subscription: {
            active: false,
            dateActivated: null,
            usageCount: 0,
        },
        recruits: []
    })
    const [recruit, setRecruit] = useState({
        id: uuidv4(),
        timeStamp: null,
        firstName: '',
        lastName: '',
        jobTitle: '',
        industry: null,
        contactInfo: {
            phone: '',
            email: '',
            socialMedia: []
        },
        address: {
            street: null,
            appt: null,
            city: null,
            state: null,
            zip: null
        },
        resume: {
            experience: null,
            education: null,
            skills: null,
            additional: null,
            summary: null,
            timeStamp: null
        },
        tailoredResume: {
            id: null,
            companyName: null,
            experience: null,
            education: null,
            skills: null,
            additional: null,
            summary: null,
            timeStamp: null,
        },
        coverLetter: {
            id: null,
            companyName: null,
            data: null,
            timeStamp: null
        },
    })
    // sets state for recruiter when routing
    const [recruitAction, setRecruitAction] = useState(null);
    const setAddingRecruit = () => {
        setRecruitAction("adding");
    };
    const setEditingRecruit = () => {
        setRecruitAction("editing");
    };
    const setViewingRecruitDetails = () => {
        setRecruitAction("viewing");
    };
    const setRecruitCreateBaseResume = () => {
        setRecruitAction("RecruitCreatingBaseResume");
    }
    const setRecruitCreateTailoredResume = () => {
        setRecruitAction("RecruitCreatingTailoredResume");
    }

    const handleChangeRecruiter = (key, value) => {
        setRecruiter(prevState => ({
            ...prevState,
            [key]: value
        }));
    };
    const handleChangeRecruiterSubscription = (key, value) => {
        setRecruiter(prevState => ({
            ...prevState,
            subscription: {
                ...prevState.subscription,
                [key]: value
            }
        }));
    };
    const addRecruitToRecruiter = (completedRecruit) => {
        setRecruiter(prevState => ({
            ...prevState,
            recruits: [...prevState.recruits, completedRecruit]
        }));
    };

    const handleRecruitChange = (key, value) => {
        setRecruit(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    const handleRecruitAddressChange = (key, value) => {
        setRecruit(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                [key]: value
            }
        }));
    };

    const handleRecruitContactChange = (key, value) => {
        setRecruit(prevState => ({
            ...prevState,
            contactInfo: {
                ...prevState.contactInfo,
                [key]: value
            }
        }));
    };

    const editRecruit = (recruitId, updatedRecruit) => {
        setRecruiter(prevState => ({
            ...prevState,
            recruits: prevState.recruits.map(recruit => {
                if (recruit.id === recruitId) {
                    return {
                        ...recruit,
                        ...updatedRecruit
                    };
                }
                return recruit; // Return unchanged recruit if ID doesn't match
            })
        }));
    };
    
    const editRecruitAddress = (recruitId, updatedAddress) => {
        setRecruiter(prevState => ({
            ...prevState,
            recruits: prevState.recruits.map(recruit => {
                if (recruit.id === recruitId) {
                    return {
                        ...recruit,
                        address: {
                            ...recruit.address,
                            ...updatedAddress
                        }
                    };
                }
                return recruit; // Return unchanged recruit if ID doesn't match
            })
        }));
    };
    
    const editRecruitContactInfo = (recruitId, updatedContactInfo) => {
        setRecruiter(prevState => ({
            ...prevState,
            recruits: prevState.recruits.map(recruit => {
                if (recruit.id === recruitId) {
                    return {
                        ...recruit,
                        contactInfo: {
                            ...recruit.contactInfo,
                            ...updatedContactInfo
                        }
                    };
                }
                return recruit; // Return unchanged recruit if ID doesn't match
            })
        }));
    };
    
    

    const handleRecruitResumeChange = (key, value) => {
        setRecruit(prevState => ({
            ...prevState,
            resume: {
                ...prevState.resume,
                [key]: value
            }
        }));
    };

    const handleRecruitTailoredResumeChange = (key, value) => {
        setRecruit(prevState => ({
            ...prevState,
            tailoredResume: {
                ...prevState.tailoredResume,
                [key]: value
            }
        }));
    };

    const handleRecruitCoverLetterChange = (key, value) => {
        setRecruit(prevState => ({
            ...prevState,
            coverLetter: {
                ...prevState.coverLetter,
                [key]: value
            }
        }));
    };

    const value = useMemo(() =>({
        recruiter, setRecruiter,
        addRecruitToRecruiter,
        recruit, setRecruit,
        handleRecruitChange,
        handleRecruitAddressChange,
        handleRecruitContactChange,
        editRecruit,editRecruitAddress,editRecruitContactInfo,
        handleRecruitResumeChange,
        handleRecruitTailoredResumeChange,
        handleRecruitCoverLetterChange,

        recruitAction, setRecruitAction,
        setAddingRecruit,
        setEditingRecruit,
        setViewingRecruitDetails,
        setRecruitCreateBaseResume,
        setRecruitCreateTailoredResume,

        selectRecruiterAvatar, setSelectRecruiterAvatar,
        handleOpenSelectRecruiterAvatar,
        handleCloseSelectRecruiterAvatar,

        businessRegistrationModal, setBusinessRegistrationModal,
        handleOpenBusinessRegModal,
        handleCloseBusinessRegModal,

        handleChangeRecruiter,
        handleChangeRecruiterSubscription,

    }), [user, registerModal, loginModal]);

    return (
        <BusinessContext.Provider value={value}>
            {children}
        </BusinessContext.Provider>
    )
}