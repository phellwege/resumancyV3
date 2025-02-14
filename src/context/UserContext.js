import React, {useContext, useEffect, useMemo, useState, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';
const UserContext = React.createContext()

export function useUser(){
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const generateUUID = () => uuidv4();
    const [loginModal, setLoginModal] = useState(false);
    const handleCloseLoginModal = () => setLoginModal(false);
    const handleOpenLoginModal = () => setLoginModal(true);

    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [selectedTailoredResumeId, setSelectedTailoredResumeId] = useState(null);
    const [selectedCoverLetterId, setSelectedCoverLetterId] = useState(null);

    // creating profile modal
    const [setupUserModal, setSetupUserModal] = useState(false);
    const handleOpenSetupUserModal = () => setSetupUserModal(true);
    const handleCloseSetupUserModal = () => setSetupUserModal(false);
    // reviewing resumes
    const [reviewResumeModal, setReviewResumeModal] = useState(false);
    const handleOpenReviewResumeModal = useCallback(() => {
        setReviewResumeModal(true);
    }, []);
    const handleCloseReviewResumeModal = () => setReviewResumeModal(false);
    // review cover letter
    const [reviewCoverLetterModal, setReviewCoverLetterModal] = useState(false);
    const handleOpenReviewCoverLetterModal = () => setReviewCoverLetterModal(true);
    const handleCloseReviewCoverLetterModal = () => setReviewCoverLetterModal(false);
    // review job Description
    const [reviewJobDescModal, setReviewJobDescModal] = useState(false);
    const handleOpenReviewJobDescModal = () => setReviewJobDescModal(true);
    const handleCloseReviewJobDescModal = () => setReviewJobDescModal(false);
    // contact us
    const [contactUsModal, setContactUsModal] = useState(false);
    const handleOpenContactUsModal = () => setContactUsModal(true);
    const handleCloseContactUsModal = () => setContactUsModal(false);
    // user avatar selection stuff
    const [selectAvatar, setSelectAvatar] = useState(false);
    const handleOpenSelectAvatar = () => setSelectAvatar(true);
    const handleCloseSelectAvatar = () => setSelectAvatar(false);

    const userAvatarKeys = [
        'WitchProfile', 'WitchProfile2', 'WitchProfile3', 'WitchProfile4', 'WitchProfile5', 
        'WizardProfile1','WizardProfile2','WizardProfile3','WizardProfile4','WizardProfile5'
    ];
    const userAvatars = userAvatarKeys.map(key => require(`../static/ProfilePics/${key}.png`));
    // user object
    const initialUserState = {
        id: null,
        firstName: '',
        lastName: '',
        jobTitle: '',
        userName: '',
        avatarImg: userAvatars[0],
        contactInfo: {
            phone: '',
            email: '',
            socialMedia: [{ name: '', url: '' }]
        },
        address: {
            useAddress: false,
            street: '',
            appt: '',
            city: '',
            state: '',
            zip: ''
        },
        resume: [{
            id: null,
            experience: [{
                expJobTitle: '',
                expCompanyName: '',
                expTime: '',
                expDesc: ''
            }],
            education: '',
            skills: '',
            additional: '',
            summary: '',
            usage: {
                timeStamp: null,
                baseResume: true,
            }
        }],
        tailoredResume: [{
            id: null,
            createdAt: null,
            companyName: '',
            description: '',
        }],
        coverLetter: [{
            id: null,
            createdAt: null,
            response: ''
        }],
        subscription: {
            active: false,
            plan: null,
            dateActivated: null,
            billingCycleStart: null,
            currentPeriodEndDate: null,
            usage: {
                baseResume: 0,
                tailoredResumes: 0,
            },
            limits: {
                baseResume: 0,
                tailoredResumes: 0,
            },
        },
        initialSetupDone: false,
        coupon: '',
        stripeCustomerId: null
    };
    const [user, setUser] = useState(initialUserState)
    const resetUser = () => setUser(initialUserState);
    
    const [includeAddress, setIncludeAddress] = useState(false);

    const subscriptionPlans = {
        price_1QrL8vEsYMRYIVaAx4EV21RU: { baseResume: 1, tailoredResumes: 5 },
        price_1QrL8vEsYMRYIVaAnoVKXDwS: { baseResume: 1, tailoredResumes: 5 },
        price_1QrL8rEsYMRYIVaAR2eJ9Vta: { baseResume: 1, tailoredResumes: Infinity },
        price_1QrL8rEsYMRYIVaABNH1JBGo: { baseResume: 1, tailoredResumes: Infinity },
    };

    const canCreateMore = (type) => {
        if (!user.subscription.active) {
            return false; 
        }
        
        const usage = user.subscription.usage[type];
        const limit = user.subscription.limits[type];
    
        return limit === Infinity || usage < limit;
    };
    
    const selectedResume = user.resume.find((resume) => resume.id === selectedResumeId);
    const selectedTailoredResumeIdData = user.tailoredResume.find((resume) => resume.id === selectedTailoredResumeId);
    const selectedCoverLetterIdData = user.coverLetter.find((resume) => resume.id === selectedCoverLetterId);
    
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const [review, setReview] = useState({
        userID : user.id,
        rating: null,
        additionalInfo: user.firstName
    });
    
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
    const handleSocialMediaChange = (index, field, value) => {
        setUser(prevUser => {
            const updatedSocialMedia = [...prevUser.contactInfo.socialMedia];
            updatedSocialMedia[index] = {
                ...updatedSocialMedia[index],
                [field]: value, // Update specific field (e.g., 'name' or 'url')
            };
            return {
                ...prevUser,
                contactInfo: {
                    ...prevUser.contactInfo,
                    socialMedia: updatedSocialMedia,
                },
            };
        });
    };
    const addSocialMediaEntry = () => {
        setUser(prevState => ({
            ...prevState,
            contactInfo: {
                ...prevState.contactInfo,
                socialMedia: [...prevState.contactInfo.socialMedia, { name: '', url: '' }]
            }
        }));
    };
    
    const removeSocialMediaEntry = (index) => {
        setUser(prevState => ({
            ...prevState,
            contactInfo: {
                ...prevState.contactInfo,
                socialMedia: prevState.contactInfo.socialMedia.filter((_, i) => i !== index)
            }
        }));
    };
    const handleResumeChange = (key, value) => {
        setUser((prevState) => {
            const updatedResume = prevState.resume.map(resume =>
                resume.id === selectedResume?.id
                    ? { ...resume, [key]: value }
                    : resume
            );
    
            return { ...prevState, resume: updatedResume };
        });
    };
    
    const handleExperienceChange = (index, key, value) => {
        setUser((prevState) => {
            const updatedResume = prevState.resume.map(resume => 
                resume.id === selectedResume.id
                ? {
                    ...resume,
                    experience: resume.experience.map((exp, expIndex) =>
                        expIndex === index ? { ...exp, [key]: value } : exp
                    ),
                }
                : resume
            );
    
            return { ...prevState, resume: updatedResume };
        });
    };
    
    const addExperienceEntry = () => {
        setUser((prevState) => ({
            ...prevState,
            resume: prevState.resume.map((resume, index) =>
                index === 0
                    ? {
                        ...resume,
                        experience: [
                            ...(resume.experience || []), 
                            { expJobTitle: '', expCompanyName: '', expTime: '', expDesc: '' }
                        ],
                    }
                    : resume
            ),
        }));
    };
    
    const removeExperienceEntry = (index) => {
        setUser((prevState) => {
            const updatedResume = [...prevState.resume];
            updatedResume[0].experience = updatedResume[0].experience.filter((_, i) => i !== index);
            return { ...prevState, resume: updatedResume };
        });
    };
    const handleTailoredResumeChange = (index, key, value) => {
        setUser((prevState) => {
            const updatedTailoredResume = [...prevState.tailoredResume];
            updatedTailoredResume[index] = {
                ...updatedTailoredResume[index],
                [key]: value,
            };
            return {
                ...prevState,
                tailoredResume: updatedTailoredResume,
            };
        });
    };
    const handleSelectAvatar = (avatarIndex) => {
        const selectedAvatar = userAvatars[avatarIndex];
        setUser(prevState => ({
            ...prevState,
            avatarImg: selectedAvatar
        }));
    };
    const stripFormatting = (phoneNumber) => {
        return phoneNumber.replace(/\D/g, '');
    };

    useEffect(() => {
        if (user.id) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); 
        } 
    }, []);
    const displayCorrectPlan = () => {
        if(user.subscription.plan == 'price_1QrL8vEsYMRYIVaAx4EV21RU'){
            return <span style={{color: "#66FF00"}}>BASIC</span>
        } else if (user.subscription.plan === 'price_1QrL8vEsYMRYIVaAnoVKXDwS') {
            return <span style={{color: "#66FF00"}}>BASIC ANNUAL</span>
        } else if (user.subscription.plan === 'price_1QrL8rEsYMRYIVaAR2eJ9Vta'){
            return <span style={{color: "gold"}}>PREMIUM</span>
        } else if (user.subscription.plan === 'price_1QrL8rEsYMRYIVaABNH1JBGo'){
            return <span style={{color: "gold"}}>PREMIUM ANNUAL</span>
        }
    }
    const value = useMemo(() =>({
        generateUUID,
        initialUserState,
        user, setUser,
        userAvatars,
        handleSelectAvatar,

        loginModal, setLoginModal,
        handleCloseLoginModal,
        handleOpenLoginModal,

        setupUserModal, setSetupUserModal,
        handleOpenSetupUserModal,
        handleCloseSetupUserModal,
        selectAvatar, setSelectAvatar,
        handleOpenSelectAvatar,
        handleCloseSelectAvatar,

        reviewJobDescModal,
        handleOpenReviewJobDescModal,
        handleCloseReviewJobDescModal,

        reviewResumeModal, setReviewResumeModal,
        handleOpenReviewResumeModal,
        handleCloseReviewResumeModal,
        reviewCoverLetterModal, setReviewCoverLetterModal,
        handleOpenReviewCoverLetterModal,
        handleCloseReviewCoverLetterModal,
        contactUsModal,
        handleOpenContactUsModal,
        handleCloseContactUsModal,

        sanitizeUserInput,

        handleResumeChange,
        handleExperienceChange,
        addExperienceEntry,
        removeExperienceEntry,
        handleTailoredResumeChange,
        handleAddressChange,
        handleContactChange,
        handleSocialMediaChange,
        addSocialMediaEntry,
        removeSocialMediaEntry,
        handleUserChange,
        canCreateMore,

        includeAddress,
        setIncludeAddress,

        stripFormatting,

        successMessage,
        setSuccessMessage,
        error,
        setError,
        subscriptionPlans,
        resetUser,
        displayCorrectPlan,

        selectedResumeId, setSelectedResumeId, selectedResume,
        selectedTailoredResumeIdData, selectedTailoredResumeId, setSelectedTailoredResumeId,
        selectedCoverLetterIdData, selectedCoverLetterId, setSelectedCoverLetterId

    }), [
        user, resetUser, loginModal, setupUserModal, selectAvatar,
        reviewResumeModal, reviewCoverLetterModal, contactUsModal, 
        handleOpenReviewResumeModal, selectedResume, selectedTailoredResumeIdData, selectedCoverLetterIdData,
        canCreateMore, error, includeAddress, 
        initialUserState, reviewJobDescModal, selectedCoverLetterId, selectedResumeId, selectedTailoredResumeId, 
        subscriptionPlans, successMessage, userAvatars
    ]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}