import { useEffect } from 'react';

const SCRIPT_ID = 'google-translate-script';
const ELEMENT_ID = 'google_translate_element';

function initWidget() {
    if (!window.google?.translate?.TranslateElement) return;

    // Clear out any stale markup (Inertia navigations mount/unmount this
    // component's <div>, and Google's script only fires its callback once
    // per page load, so we re-run the init ourselves on every mount).
    const el = document.getElementById(ELEMENT_ID);
    if (el) el.innerHTML = '';

    new window.google.translate.TranslateElement(
        {
            pageLanguage: 'en',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        ELEMENT_ID,
    );
}

/**
 * Drop-in replacement for the old custom i18n LanguageSwitcher. Instead of
 * maintaining a translation dictionary, this renders Google's "Translate
 * Element" widget, which translates the live DOM of whichever page it's
 * mounted on — so every page (public site, dashboard, admin) gets
 * translation support for free, without per-string upkeep.
 *
 * `variant="dark"` is for dark navy headers; `variant="light"` (default)
 * is for white admin/user topbars.
 */
export default function GoogleTranslate({ variant = 'light' }) {
    useEffect(() => {
        if (window.google?.translate?.TranslateElement) {
            initWidget();
            return;
        }

        window.googleTranslateElementInit = initWidget;

        if (!document.getElementById(SCRIPT_ID)) {
            const script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return <div id={ELEMENT_ID} className={`gt-widget gt-widget--${variant}`} />;
}
