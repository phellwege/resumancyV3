// No accounts in the static build. This context now holds the visitor's
// OpenAI key and model choice, and keeps the old useAuth() shape so existing
// components (setLoading, logout, currentUser) keep working.
import React, { useContext, useMemo, useState } from 'react';
import LoadingPage from '../components/loadingPage/LoadingPage';
import { useUser } from './UserContext';
import { KEYS, readString, writeString, remove, clearAll } from '../lib/storage';
import { DEFAULT_MODEL } from '../lib/openai';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const { user, setUser, initialUserState } = useUser();
    const [loading, setLoading] = useState(false);

    const storedKey = readString(KEYS.apiKey, '');
    const [apiKey, setApiKeyState] = useState(storedKey);
    const [rememberKey, setRememberKeyState] = useState(Boolean(storedKey));
    const [model, setModelState] = useState(readString(KEYS.model, DEFAULT_MODEL) || DEFAULT_MODEL);

    const saveSettings = ({ apiKey: nextKey, model: nextModel, remember }) => {
        const key = (nextKey || '').trim();
        setApiKeyState(key);
        setRememberKeyState(remember);
        if (remember && key) writeString(KEYS.apiKey, key);
        else remove(KEYS.apiKey);
        const m = (nextModel || DEFAULT_MODEL).trim();
        setModelState(m);
        writeString(KEYS.model, m);
    };

    const forgetKey = () => {
        setApiKeyState('');
        setRememberKeyState(false);
        remove(KEYS.apiKey);
    };

    // "Log out" now means: wipe everything this browser stored.
    const logout = async () => {
        clearAll();
        setApiKeyState('');
        setRememberKeyState(false);
        setModelState(DEFAULT_MODEL);
        setUser(initialUserState);
    };

    const value = useMemo(() => ({
        // settings
        apiKey,
        model,
        rememberKey,
        hasApiKey: Boolean(apiKey),
        saveSettings,
        forgetKey,
        // legacy shape
        currentUser: user?.id ? { uid: user.id } : null,
        emailVerified: true,
        loading,
        setLoading,
        logout,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [apiKey, model, rememberKey, loading, user?.id]);

    return (
        <AuthContext.Provider value={value}>
            {loading ? <LoadingPage /> : children}
        </AuthContext.Provider>
    );
}
