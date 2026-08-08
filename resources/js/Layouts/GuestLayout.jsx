// resources/js/Layouts/GuestLayout.jsx

import { Link, usePage } from "@inertiajs/react";
import { ShieldCheck, BadgeCheck, Globe2 } from "lucide-react";
import GoogleTranslate from "@/Components/GoogleTranslate";

export default function GuestLayout({ children }) {
    const { settings } = usePage().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

            <div className="fixed top-4 right-4 z-50">
                <GoogleTranslate />
            </div>

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* ================================= LEFT SIDE ================================= */}

                <div className="relative hidden overflow-hidden bg-slate-900 lg:flex">

                    <img
                        src="./images/logo.png"
                        alt="United Care Alliance"
                        className="absolute inset-0 h-full w-full object-cover opacity-25"
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-blue-900/80" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-16">

                        <div>

                            <Link
                                href="/"
                                className="flex items-center gap-4"
                            >

                                <img
                                    src="/images/logo.png"
                                    className="h-16 w-auto"
                                    alt="United Care Alliance"
                                />


                            </Link>

                        </div>

                        <div className="max-w-xl">

                            <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-300">

                                Trusted Assistance Platform

                            </span>

                            <h2 className="mt-8 text-5xl font-bold leading-tight text-white">

                                Empowering Communities Through Trusted Assistance.

                            </h2>

                            <p className="mt-8 text-lg leading-8 text-slate-300">

                                Access secure application services,
                                transparent verification,
                                and community assistance programs
                                through one trusted platform.

                            </p>

                        </div>

                        <div className="grid gap-5">

                            {[
                                {
                                    icon: ShieldCheck,
                                    title: "Secure Application",
                                },
                                {
                                    icon: BadgeCheck,
                                    title: "Verified Review Process",
                                },
                                {
                                    icon: Globe2,
                                    title: "Available Worldwide",
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur"
                                    >

                                        <div className="rounded-xl bg-blue-600 p-3">

                                            <Icon
                                                size={22}
                                                className="text-white"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-white">
                                                {item.title}
                                            </h3>

                                            <p className="text-sm text-slate-300">
                                                Built around transparency and trust.
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>

                {/* ================================= RIGHT SIDE ================================= */}

                <div className="flex items-center justify-center px-6 py-12">

                    <div className="w-full max-w-lg">

                        {/* Mobile Logo */}

                        <div className="mb-10 text-center lg:hidden">

                            <Link
                                href="/"
                                className="inline-flex flex-col items-center"
                            >

                                <img
                                    src="/images/logo.png"
                                    className="h-16"
                                    alt="United Care Alliance"
                                />

                                <h2 className="mt-4 text-2xl font-bold">

                                    {settings?.company_name ??
                                        "United Care Alliance"}

                                </h2>

                            </Link>

                        </div>

                        <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl">

                            {children}

                        </div>

                        <p className="mt-8 text-center text-sm text-slate-500">

                            © {new Date().getFullYear()} United Care Alliance

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}