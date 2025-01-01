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

    }), [user, loginModal]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}