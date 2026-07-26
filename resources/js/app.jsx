import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// App display name — used in browser tab titles (e.g. "Home - United Care Alliance | United States")
const APP_NAME = import.meta.env.VITE_APP_NAME || 'United Care Alliance | United States';

createInertiaApp({
    title: (title) => (title ? `${title} - ${APP_NAME}` : APP_NAME),

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },

    progress: {
        color: '#4B5563',
        showSpinner: true,
    },
});