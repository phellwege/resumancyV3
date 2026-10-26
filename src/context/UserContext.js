import React, {useContext, useEffect, useMemo, useState, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';
import { KEYS, readJSON, writeJSON } from '../lib/storage';

// Import all profile pictures statically to ensure they work in production
import WitchProfile from '../static/ProfilePics/WitchProfile.webp';
import WitchProfile2 from '../static/ProfilePics/WitchProfile2.webp';
import WitchProfile3 from '../static/ProfilePics/WitchProfile3.webp';
import WitchProfile4 from '../static/ProfilePics/WitchProfile4.webp';
import WitchProfile5 from '../static/ProfilePics/WitchProfile5.webp';
import WizardProfile1 from '../static/ProfilePics/WizardProfile1.webp';
import WizardProfile2 from '../static/ProfilePics/WizardProfile2.webp';
import WizardProfile3 from '../static/ProfilePics/WizardProfile3.webp';
import WizardProfile4 from '../static/ProfilePics/WizardProfile4.webp';
import WizardProfile5 from '../static/ProfilePics/WizardProfile5.webp';

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
    // gap analysis modal
    const [gapAnalysisModal, setGapAnalysisModal] = useState(false);
    const [selectedGapAnalysis, setSelectedGapAnalysis] = useState('');
    const handleOpenGapAnalysisModal = (gapText) => {
        setSelectedGapAnalysis(gapText);
        setGapAnalysisModal(true);
    };
    const handleCloseGapAnalysisModal = () => setGapAnalysisModal(false);
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
    // delete acct
    const [deleteAcctModal, setDeleteAcctModal] = useState(false);
    const handleOpenDeleteAcctModal = () => setDeleteAcctModal(true);
    const handleCloseDeleteAcctModal = () => setDeleteAcctModal(false);
    // user avatar selection stuff
    const [selectAvatar, setSelectAvatar] = useState(false);
    const handleOpenSelectAvatar = () => setSelectAvatar(true);
    const handleCloseSelectAvatar = () => setSelectAvatar(false);

    // Define avatar images with static imports
    const userAvatars = [
        WitchProfile, WitchProfile2, WitchProfile3, WitchProfile4, WitchProfile5,
        WizardProfile1, WizardProfile2, WizardProfile3, WizardProfile4, WizardProfile5
    ];
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
            customSections: [{
                sectionName: 'Projects',
                entries: [{
                    title: '',
                    timeframe: '',
                    description: ''
                }]
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
            matchPercent: '',
            skillGapAnalysis: '',
        }],
        coverLetter: [{
            id: null,
            createdAt: null,
            response: ''
        }],
        // No plans in the static build. Usage counters still drive the nav.
        subscription: {
            active: true,
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
        referrals: {
            referralCode: '',
            referredBy: '',
            referredUsers: [],
            pendingReferrals: [],
            paidReferrals: [],
            rewardsEarned: [],
            availableRewards: []
        },
        initialSetupDone: false,
    };
    // Restore the profile saved in this browser, if any.
    const [user, setUser] = useState(() => {
        const saved = readJSON(KEYS.user);
        if (!saved || saved.version !== 3 || !saved.data?.id) return initialUserState;
        const data = { ...initialUserState, ...saved.data };
        if (!userAvatars.includes(data.avatarImg)) data.avatarImg = userAvatars[0];
        return data;
    })
    const resetUser = () => setUser(initialUserState);
    
    const [includeAddress, setIncludeAddress] = useState(false);

    // Bring-your-own-key: no plan limits.
    const canCreateMore = () => true;

    // Start a local profile (stands in for the old sign-up).
    const startProfile = () => {
        setUser((prev) => (prev.id ? prev : { ...prev, id: uuidv4() }));
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
    const handleCustomSectionNameChange = (sectionIndex, value) => {
        setUser((prevState) => {
            const updatedResume = [...prevState.resume];
            const updatedCustomSections = [...updatedResume[0].customSections];
            updatedCustomSections[sectionIndex] = {
                ...updatedCustomSections[sectionIndex],
                sectionName: sanitizeUserInput(value)
            };
            updatedResume[0] = {
                ...updatedResume[0],
                customSections: updatedCustomSections
            };
            return { ...prevState, resume: updatedResume };
        });
    };

    const handleCustomSectionEntryChange = (sectionIndex, entryIndex, key, value) => {
        setUser((prevState) => {
            const updatedResume = [...prevState.resume];
            const updatedCustomSections = [...updatedResume[0].customSections];
            const updatedEntries = [...updatedCustomSections[sectionIndex].entries];
            
            updatedEntries[entryIndex] = {
                ...updatedEntries[entryIndex],
                [key]: sanitizeUserInput(value)
            };
            
            updatedCustomSections[sectionIndex] = {
                ...updatedCustomSections[sectionIndex],
                entries: updatedEntries
            };
            
            updatedResume[0] = {
                ...updatedResume[0],
                customSections: updatedCustomSections
            };
            
            return { ...prevState, resume: updatedResume };
        });
    };
    
    const addCustomSection = () => {
        setUser((prevState) => ({
            ...prevState,
            resume: prevState.resume.map((resume, index) =>
                index === 0
                    ? {
                        ...resume,
                        customSections: [
                            ...(resume.customSections || []), 
                            {
                                sectionName: 'New Section',
                                entries: [{
                                    title: '',
                                    timeframe: '',
                                    description: ''
                                }]
                            }
                        ],
                    }
                    : resume
            ),
        }));
    };
    
    const removeCustomSection = (sectionIndex) => {
        setUser((prevState) => {
            const updatedResume = [...prevState.resume];
            updatedResume[0].customSections = updatedResume[0].customSections.filter((_, i) => i !== sectionIndex);
            return { ...prevState, resume: updatedResume };
        });
    };
    
    const addCustomSectionEntry = (sectionIndex) => {
        setUser((prevState) => {
            const updatedResume = [...prevState.resume];
            const updatedCustomSections = [...updatedResume[0].customSections];
            
            updatedCustomSections[sectionIndex] = {
                ...updatedCustomSections[sectionIndex],
                entries: [
                    ...updatedCustomSections[sectionIndex].entries,
                    {
                        title: '',
                        timeframe: '',
                        description: ''
                    }
                ]
            };
            
            updatedResume[0] = {
                ...updatedResume[0],
                customSections: updatedCustomSections
            };
            
            return { ...prevState, resume: updatedResume };
        });
    };
    
    const removeCustomSectionEntry = (sectionIndex, entryIndex) => {
        setUser((prevState) => {
            const updatedResume = [...prevState.resume];
            const updatedCustomSections = [...updatedResume[0].customSections];
            
            updatedCustomSections[sectionIndex] = {
                ...updatedCustomSections[sectionIndex],
                entries: updatedCustomSections[sectionIndex].entries.filter((_, i) => i !== entryIndex)
            };
            
            updatedResume[0] = {
                ...updatedResume[0],
                customSections: updatedCustomSections
            };
            
            return { ...prevState, resume: updatedResume };
        });
    };
    
    // Legacy function names for backward compatibility
    const handleProjectChange = (index, key, value) => {
        // Map the old project keys to new custom section entry keys
        const keyMap = {
            projectTitle: 'title',
            projectTime: 'timeframe',
            projectSummary: 'description'
        };
        
        // Use the first custom section (index 0) as the default Projects section
        handleCustomSectionEntryChange(0, index, keyMap[key] || key, value);
    };
    
    const addProjectEntry = () => {
        // Add an entry to the first custom section (index 0)
        addCustomSectionEntry(0);
    };
    
    const removeProjectEntry = (index) => {
        // Remove an entry from the first custom section (index 0)
        removeCustomSectionEntry(0, index);
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

    // Mirror the whole profile to this browser only.
    useEffect(() => {
        if (user.id) writeJSON(KEYS.user, { version: 3, data: user });
    }, [user]);

    const describeBaseResume = "A Base Resume is the starting point for Resumancy. You provide your resume details, and the AI enhances and customizes it to present your experience in the best light.";
    const describeTailoredResume = "A Tailored Resume is built from your Base Resume and optimized for a specific job. Simply paste the job description and company name, and the AI adjusts your resume to highlight the most relevant skills and experience, boosting your chances of landing the role.";
    
    const value = useMemo(() =>({
        describeBaseResume,
        describeTailoredResume,
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

        deleteAcctModal,
        setDeleteAcctModal,
        handleOpenDeleteAcctModal,
        handleCloseDeleteAcctModal,

        gapAnalysisModal,
        setGapAnalysisModal,
        handleOpenGapAnalysisModal,
        handleCloseGapAnalysisModal,
        selectedGapAnalysis, setSelectedGapAnalysis,

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
        // Custom Sections (New API)
        handleCustomSectionNameChange,
        handleCustomSectionEntryChange,
        addCustomSection,
        removeCustomSection,
        addCustomSectionEntry,
        removeCustomSectionEntry,
        
        // Projects (Legacy API - for backward compatibility)
        handleProjectChange,
        addProjectEntry,
        removeProjectEntry,
        handleTailoredResumeChange,
        handleAddressChange,
        handleContactChange,
        handleSocialMediaChange,
        addSocialMediaEntry,
        removeSocialMediaEntry,
        handleUserChange,
        canCreateMore,
        startProfile,

        includeAddress,
        setIncludeAddress,

        stripFormatting,

        successMessage,
        setSuccessMessage,
        error,
        setError,
        resetUser,

        selectedResumeId, setSelectedResumeId, selectedResume,
        selectedTailoredResumeIdData, selectedTailoredResumeId, setSelectedTailoredResumeId,
        selectedCoverLetterIdData, selectedCoverLetterId, setSelectedCoverLetterId,
        
    }), [
        user, resetUser, loginModal, setupUserModal, selectAvatar,
        reviewResumeModal, reviewCoverLetterModal, contactUsModal, 
        gapAnalysisModal,
        handleOpenReviewResumeModal, selectedResume, selectedTailoredResumeIdData, selectedCoverLetterIdData,
        canCreateMore, error, includeAddress, 
        initialUserState, reviewJobDescModal, selectedCoverLetterId, selectedResumeId, selectedTailoredResumeId, 
        successMessage, userAvatars
    ]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}