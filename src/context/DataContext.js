// Local-only data layer. Everything lives in React state and is mirrored to
// this browser's localStorage by UserContext. Nothing is sent to a server.
import React, { useContext, useMemo, useState } from 'react';
import LoadingPage from '../components/loadingPage/LoadingPage';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { clearAll } from '../lib/storage';

const DataContext = React.createContext();

export function useData() {
    return useContext(DataContext);
}

const mergeUser = (prev, updated) => ({
    ...prev,
    ...updated,
    contactInfo: { ...prev.contactInfo, ...updated.contactInfo },
    address: { ...prev.address, ...updated.address },
    subscription: {
        ...prev.subscription,
        ...updated.subscription,
        usage: { ...prev.subscription?.usage, ...updated.subscription?.usage },
        limits: { ...prev.subscription?.limits, ...updated.subscription?.limits },
    },
});

export function DataProvider({ children }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user, setUser, setSuccessMessage, initialUserState } = useUser();

    const updateUserData = async (_userId, updatedData) => {
        setUser((prev) => mergeUser(prev, updatedData));
    };
    const saveUserData = updateUserData;
    const saveBaselineResume = async (_userId, fields) => {
        setUser((prev) => ({ ...prev, ...fields }));
        return { status: 200 };
    };

    const addTailoredResume = async (_userId, newResume, newTailoredEntry) => {
        setUser((prev) => ({
            ...prev,
            resume: [...prev.resume, newResume],
            tailoredResume: [
                ...prev.tailoredResume.filter((tr) => tr.id !== newTailoredEntry.id),
                newTailoredEntry,
            ],
            subscription: {
                ...prev.subscription,
                usage: {
                    ...prev.subscription.usage,
                    tailoredResumes: (prev.subscription.usage.tailoredResumes || 0) + 1,
                },
            },
        }));
    };

    const addCoverLetter = async (_userId, newCoverLetter) => {
        setUser((prev) => ({ ...prev, coverLetter: [...prev.coverLetter, newCoverLetter] }));
    };

    const updateSpecificResume = async (_userId, updatedResume) => {
        setUser((prev) => ({
            ...prev,
            resume: prev.resume.map((r) => (r.id === updatedResume.id ? { ...r, ...updatedResume } : r)),
        }));
        setSuccessMessage('✅ Resume saved in this browser.');
    };

    const updateSpecificCoverLetter = async (_userId, updated) => {
        setUser((prev) => ({
            ...prev,
            coverLetter: prev.coverLetter.map((cl) => (cl.id === updated.id ? updated : cl)),
        }));
        setSuccessMessage('✅ Cover letter saved in this browser.');
    };

    const fetchResumes = async () => user.resume || [];
    const fetchCoverLetters = async () => user.coverLetter || [];

    const readyBaseResume = useMemo(
        () => (user.resume || []).filter((r) => r.id && r.usage?.baseResume === true),
        [user.resume]
    );

    const readyTailoredResume = useMemo(
        () =>
            (user.resume || [])
                .filter((r) => r.id && !r.usage?.baseResume)
                .map((resume) => {
                    const t = user.tailoredResume.find((tr) => tr.id === resume.id);
                    return {
                        ...resume,
                        companyName: t?.companyName || 'Unknown',
                        matchPercent: t?.matchPercent ?? 'N/A',
                        skillGapAnalysis: t?.skillGapAnalysis || '',
                    };
                }),
        [user.resume, user.tailoredResume]
    );

    const deleteUserAccount = async () => {
        clearAll();
        setUser(initialUserState);
        navigate('/');
        return { success: true };
    };

    const value = {
        loading,
        setLoading,
        updateUserData,
        saveUserData,
        saveBaselineResume,
        addTailoredResume,
        addCoverLetter,
        fetchResumes,
        fetchCoverLetters,
        updateSpecificResume,
        updateSpecificCoverLetter,
        readyTailoredResume,
        readyBaseResume,
        deleteUserAccount,
    };

    return (
        <DataContext.Provider value={value}>
            {loading ? <LoadingPage /> : children}
        </DataContext.Provider>
    );
}
