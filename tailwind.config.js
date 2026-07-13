// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#262C55',
                    light: '#3A4270',
                    dark: '#1A1E3D',
                },
                signal: {
                    DEFAULT: '#FB9129',
                    light: '#FFB25C',
                    dark: '#E07A16',
                },
                ink: '#000000',
                cloud: '#F6F7FB',
                status: {
                    approved: '#1E9E5A',
                    pending: '#FFB25C',
                    rejected: '#E5484D',
                },
            },
            fontFamily: {
                display: ['Sora', ...defaultTheme.fontFamily.sans],
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [forms],
};