import React, {useContext, useEffect, useState} from 'react';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';

const UserContext = React.createContext()

export function useUser(){
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const generateUUID = () => uuidv4();
    const [registerModal, setRegisterModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const handleCloseLoginModal = () => setLoginModal(false);
    const handleOpenLoginModal = () => setLoginModal(true);
    const handleCloseRegisterModal = () => setRegisterModal(false);
    const handleOpenRegisterModal = () => setRegisterModal(true);

    const [businessRegistrationModal, setBusinessRegistrationModal] = useState(false);
    const handleOpenBusinessRegModal = () => setBusinessRegistrationModal(true);
    const handleCloseBusinessRegModal = () => setBusinessRegistrationModal(false);

    // creating profile modal
    const [setupUserModal, setSetupUserModal] = useState(false);
    const handleOpenSetupUserModal = () => setSetupUserModal(true);
    const handleCloseSetupUserModal = () => setSetupUserModal(false);

    // reviewing resumes and cover letter modals
    const [reviewBaseResumeModal, setReviewBaseResumeModal] = useState(false);
    const handleOpenReviewBaseResumeModal = () => setReviewBaseResumeModal(true);
    const handleCloseReviewBaseResumeModal = () => setReviewBaseResumeModal(false);
    const [reviewTailoredResumeModal, setReviewTailoredResumeModal] = useState(false);
    const handleOpenReviewTailoredResumeModal = () => setReviewTailoredResumeModal(true);
    const handleCloseReviewTailoredResumeModal = () => setReviewTailoredResumeModal(false);
    const [reviewCoverLetterModal, setReviewCoverLetterModal] = useState(false);
    const handleOpenReviewCoverLetterModal = () => setReviewCoverLetterModal(true);
    const handleCloseReviewCoverLetterModal = () => setReviewCoverLetterModal(false);
    
    // user avatar selection stuff
    const [selectAvatar, setSelectAvatar] = useState(false);
    const handleOpenSelectAvatar = () => setSelectAvatar(true);
    const handleCloseSelectAvatar = () => setSelectAvatar(false);
    const [selectRecruiterAvatar, setSelectRecruiterAvatar] = useState(false);
    const handleOpenSelectRecruiterAvatar = () => setSelectRecruiterAvatar(true);
    const handleCloseSelectRecruiterAvatar = () => setSelectRecruiterAvatar(false);
    const userAvatarKeys = [
        'WitchProfile', 'WitchProfile2', 'WitchProfile3', 'WitchProfile4', 'WitchProfile5', 
        'WizardProfile1','WizardProfile2','WizardProfile3','WizardProfile4','WizardProfile5'
    ];
    const userAvatars = userAvatarKeys.map(key => require(`../static/ProfilePics/${key}.png`));
    // user object
    const [user, setUser] = useState({
        id: null,
        recruiter: false,
        firstName: '',
        lastName: '',
        jobTitle: '',
        userName: '',
        avatarImg: userAvatars[0],
        contactInfo: {
            phone: '',
            email: '',
            socialMedia: []
        },
        address: {
            street: '',
            appt: '',
            city: '',
            state: '',
            zip: ''
        },
        resume: {
            experience: '',
            education: '',
            skills: '',
            additional: '',
            summary: null,
            usage: {
                counter: 0,
                timeStamp: null
            }
        },
        tailoredResume: {
            companyName: '',
            description: '',
            experience: '',
            education: '',
            skills: '',
            additional: '',
            summary: '',
            usage: {
                counter: 0,
                timeStamp: null
            }
        },
        coverLetter: {
            companyName: '',
            data: '',
            timeStamp: null,
        },
        subscription: {
            active: false,
            dateActivated: null,
        }
    })
    // recruiter tiers are as follow:
    // <option value={1}>Casual Recruiters (1-10 recruits per month)</option>
    // <option value={2}>Moderate Recruiters (11-50 recruits per month)</option>
    // <option value={3}>High-Volume Recruiters (51+ recruits per month)</option>
    // pricing is adjusted as follows
    // 1 price is 4.99 / mo
    // 2 price is 19.99 / mo
    // 3 price is 49.99 / mo
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

    const [review, setReview] = useState({
        userID : user.id,
        rating: null,
        additionalInfo: null
    })

    // prevent xss attacks
    const sanitizeUserInput = (input) => {
        return DOMPurify.sanitize(input);
    };
    // handleChange user Functions
    const handleUserChange = (key, value) => {
        setUser(prevState => ({
            ...prevState,
            [key]: value
        }));
    };
    const handleAddressChange = (key, value) => {
        setUser(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                [key]: value
            }
        }));
    };
    const handleContactChange = (key, value) => {
        setUser(prevState => ({
            ...prevState,
            contactInfo: {
                ...prevState.contactInfo,
                [key]: value
            }
        }));
    };
    const handleResumeChange = (key, value) => {
        setUser(prevState => ({
            ...prevState,
            resume: {
                ...prevState.resume,
                [key]: value
            }
        }));
    };
    const handleTailoredResumeChange = (key, value) => {
        setUser(prevState => ({
            ...prevState,
            tailoredResume: {
                ...prevState.tailoredResume,
                [key]: value
            }
        }));
    };
    const handleSelectAvatar = (avatarIndex) => {
        const selectedAvatar = userAvatars[avatarIndex];
        setUser(prevState => ({
            ...prevState,
            avatarImg: selectedAvatar
        }));
    };

    // handleChange Recruiter
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

    // handleChange Recruit
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

    // editing recruits
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


    const value = {
        generateUUID,
        user, setUser,
        userAvatars,
        handleSelectAvatar,

        registerModal, setRegisterModal,
        loginModal, setLoginModal,
        handleCloseLoginModal,
        handleOpenLoginModal,
        handleCloseRegisterModal,
        handleOpenRegisterModal,

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

        businessRegistrationModal, setBusinessRegistrationModal,
        handleOpenBusinessRegModal,
        handleCloseBusinessRegModal,

        setupUserModal, setSetupUserModal,
        handleOpenSetupUserModal,
        handleCloseSetupUserModal,
        selectAvatar, setSelectAvatar,
        handleOpenSelectAvatar,
        handleCloseSelectAvatar,
        selectRecruiterAvatar, setSelectRecruiterAvatar,
        handleOpenSelectRecruiterAvatar,
        handleCloseSelectRecruiterAvatar,

        reviewBaseResumeModal, setReviewBaseResumeModal,
        handleOpenReviewBaseResumeModal,
        handleCloseReviewBaseResumeModal,
        reviewTailoredResumeModal, setReviewTailoredResumeModal,
        handleOpenReviewTailoredResumeModal,
        handleCloseReviewTailoredResumeModal,
        reviewCoverLetterModal, setReviewCoverLetterModal,
        handleOpenReviewCoverLetterModal,
        handleCloseReviewCoverLetterModal,

        sanitizeUserInput,

        handleResumeChange,
        handleTailoredResumeChange,
        handleAddressChange,
        handleContactChange,
        handleUserChange,

        handleChangeRecruiter,
        handleChangeRecruiterSubscription,

    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}