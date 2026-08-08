import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from './translations';

export const SUPPORTED_LOCALES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
];

const STORAGE_KEY = 'uca_locale';
const DEFAULT_LOCALE = 'en';

const I18nContext = createContext(null);

function detectInitialLocale() {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;

    // Fall back to the browser's language if we support it, otherwise English.
    const browserLang = (navigator.language || '').slice(0, 2);
    if (translations[browserLang]) return browserLang;

    return DEFAULT_LOCALE;
}

export function I18nProvider({ children }) {
    const [locale, setLocaleState] = useState(detectInitialLocale);

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const setLocale = useCallback((next) => {
        if (!translations[next]) return;
        window.localStorage.setItem(STORAGE_KEY, next);
        setLocaleState(next);
    }, []);

    const t = useCallback(
        (key) => translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key] ?? key,
        [locale],
    );

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return ctx;
}
