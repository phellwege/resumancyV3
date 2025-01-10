import React, {useContext, useEffect, useMemo, useState} from 'react';
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


    // creating profile modal
    const [setupUserModal, setSetupUserModal] = useState(false);
    const handleOpenSetupUserModal = () => setSetupUserModal(true);
    const handleCloseSetupUserModal = () => setSetupUserModal(false);

    // reviewing resumes and cover letter modals
    const [reviewResumeModal, setReviewResumeModal] = useState(false);
    const handleOpenReviewResumeModal = () => setReviewResumeModal(true);
    const handleCloseReviewResumeModal = () => setReviewResumeModal(false);
    const [reviewCoverLetterModal, setReviewCoverLetterModal] = useState(false);
    const handleOpenReviewCoverLetterModal = () => setReviewCoverLetterModal(true);
    const handleCloseReviewCoverLetterModal = () => setReviewCoverLetterModal(false);
    
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
    const [user, setUser] = useState({
        id: null,
        firstName: '', // can be obtained via display name
        lastName: '', // can be obtained via display name
        jobTitle: '',
        userName: '',
        avatarImg: userAvatars[0],
        contactInfo: {
            phone: '',
            email: '',
            socialMedia: [
                { 
                    name: '', 
                    url: '' 
                }
            ]
        },
        address: {
            street: '',
            appt: '',
            city: '',
            state: '',
            zip: ''
        },
        resume: {
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
                useAddress: null
            }
        },
        tailoredResume: {
            id: null,
            companyName: '',
            description: '',
        },
        coverLetter: {
            companyName: '',
            data: '',
            timeStamp: null,
        },
        subscription: {
            active: false,
            dateActivated: null,
        },
    })

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
        setUser(prevState => ({
            ...prevState,
            resume: {
                ...prevState.resume,
                [key]: value
            }
        }));
    };
    const handleExperienceChange = (index, key, value) => {
        setUser(prevState => ({
            ...prevState,
            resume: {
                ...prevState.resume,
                experience: prevState.resume.experience.map((item, i) =>
                    i === index ? { ...item, [key]: value } : item
                )
            }
        }));
    };
    const addExperienceEntry = () => {
        setUser(prevState => ({
            ...prevState,
            resume: {
                ...prevState.resume,
                experience: [
                    ...prevState.resume.experience,
                    { expJobTitle: '', expCompanyName: '', expTime: '', expDesc: '' }
                ]
            }
        }));
    };
    
    const removeExperienceEntry = (index) => {
        setUser(prevState => ({
            ...prevState,
            resume: {
                ...prevState.resume,
                experience: prevState.resume.experience.filter((_, i) => i !== index)
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
    const stripFormatting = (phoneNumber) => {
        return phoneNumber.replace(/\D/g, '');
    };

    const value = useMemo(() =>({
        generateUUID,
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

        reviewResumeModal, setReviewResumeModal,
        handleOpenReviewResumeModal,
        handleCloseReviewResumeModal,
        reviewCoverLetterModal, setReviewCoverLetterModal,
        handleOpenReviewCoverLetterModal,
        handleCloseReviewCoverLetterModal,

        sanitizeUserInput,

        handleResumeChange,
        handleExperienceChange,
        addExperienceEntry,
        removeExperienceEntry,
        handleTailoredResumeChange, // will need DB in order to perform this action. (I will need to fetch the base resume from the db and pass it as a state object)
        handleAddressChange,
        handleContactChange,
        handleSocialMediaChange,
        addSocialMediaEntry,
        removeSocialMediaEntry,
        handleUserChange,

        stripFormatting,

    }), [
        user, loginModal, setupUserModal, selectAvatar,
        reviewResumeModal, reviewCoverLetterModal
    ]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}