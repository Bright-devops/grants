// tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            colors: {
                // ===== PRIMARY BRAND =====
                primary: {
                    50: "#EFF6FF",
                    100: "#DBEAFE",
                    200: "#BFDBFE",
                    300: "#93C5FD",
                    400: "#60A5FA",
                    500: "#3B82F6",
                    600: "#2563EB",
                    700: "#1D4ED8",
                    800: "#1E40AF",
                    900: "#1E3A8A",
                },

                // ===== SLATE / TEXT =====
                slate: {
                    50: "#F8FAFC",
                    100: "#F1F5F9",
                    200: "#E2E8F0",
                    300: "#CBD5E1",
                    400: "#94A3B8",
                    500: "#64748B",
                    600: "#475569",
                    700: "#334155",
                    800: "#1E293B",
                    900: "#0F172A",
                },

                // ===== SEMANTIC BASE TOKENS =====
                // cloud = page background (matches slate-50)
                // ink   = primary text color (matches slate-900)
                cloud: "#F8FAFC",
                ink: "#0F172A",

                // ===== SUCCESS =====
                success: {
                    50: "#ECFDF5",
                    100: "#D1FAE5",
                    500: "#10B981",
                    600: "#059669",
                    700: "#047857",
                },

                // ===== WARNING =====
                warning: {
                    50: "#FFFBEB",
                    100: "#FEF3C7",
                    500: "#F59E0B",
                    600: "#D97706",
                },

                // ===== DANGER =====
                danger: {
                    50: "#FEF2F2",
                    100: "#FEE2E2",
                    500: "#EF4444",
                    600: "#DC2626",
                },

                white: "#FFFFFF",
                black: "#000000",
            },

            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],

                display: [
                    "Sora",
                    ...defaultTheme.fontFamily.sans,
                ],

                mono: [
                    '"JetBrains Mono"',
                    ...defaultTheme.fontFamily.mono,
                ],
            },

            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
                "3xl": "1.75rem",
                "4xl": "2rem",
            },

            boxShadow: {
                card: "0 10px 30px rgba(15,23,42,.08)",
                lg: "0 20px 45px rgba(15,23,42,.10)",
                xl: "0 30px 60px rgba(15,23,42,.12)",
            },
        },
    },

    plugins: [forms],
};