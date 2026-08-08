import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation, SUPPORTED_LOCALES } from '@/i18n/I18nContext';

/**
 * Compact language switcher for headers/topbars.
 * `variant="dark"` is for use on a dark navy background (public site header);
 * `variant="light"` (default) is for the white admin/user topbars.
 */
export default function LanguageSwitcher({ variant = 'light' }) {
    const { locale, setLocale, t } = useTranslation();
    const [open, setOpen] = useState(false);
    const current = SUPPORTED_LOCALES.find((l) => l.code === locale);
    const isDark = variant === 'dark';

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                title={t('language')}
                className={`flex items-center gap-1.5 text-sm font-medium px-2 py-1.5 rounded-lg transition-colors
                    ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-navy/60 hover:text-navy hover:bg-cloud'}`}
            >
                <Globe size={16} />
                <span className="hidden sm:inline">{current?.code.toUpperCase()}</span>
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-navy/10 py-1 z-20">
                        {SUPPORTED_LOCALES.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => {
                                    setLocale(l.code);
                                    setOpen(false);
                                }}
                                className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-cloud
                                    ${l.code === locale ? 'text-signal font-semibold' : 'text-navy/70'}`}
                            >
                                {l.label}
                                {l.code === locale && <span className="text-xs">✓</span>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
