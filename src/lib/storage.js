// Safe wrappers around localStorage. Private windows, blocked site data or a
// full quota make the accessor throw; the app keeps working in memory then.

export function readJSON(key, fallback = null) {
    try {
        const raw = window.localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function writeJSON(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

export function readString(key, fallback = '') {
    try {
        const raw = window.localStorage.getItem(key);
        return raw == null ? fallback : raw;
    } catch {
        return fallback;
    }
}

export function writeString(key, value) {
    try {
        window.localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

export function remove(key) {
    try {
        window.localStorage.removeItem(key);
    } catch {
        // nothing to clean up
    }
}

// Every key this app writes. "Delete my data" removes all of them.
export const KEYS = {
    user: 'resumancy.user.v3',
    apiKey: 'resumancy.openaiKey',
    model: 'resumancy.model',
    theme: 'UnleashedCVWizardThemeKey',
};

export function clearAll() {
    Object.values(KEYS).forEach(remove);
    // Leftovers from the old hosted version, if this browser used it.
    ['user', 'authToken', 'emailForSignIn'].forEach(remove);
}
