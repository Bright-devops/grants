// resources/js/Layouts/UserLayout.jsx
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import * as Icons from 'lucide-react';
import { userNav } from '@/Config/navigation';

export default function UserLayout({ children, header }) {
    const { auth, ziggy } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentRoute = ziggy?.location ?? '';
    const kycStatus = auth.user.latest_kyc?.status ?? null;

    return (
        <div className="min-h-screen bg-cloud flex">
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy text-white flex flex-col transition-transform duration-200
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <span className="font-display font-bold text-lg tracking-tight">
                        Grant<span className="text-signal">Portal</span>
                    </span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {userNav.map((item) => {
                        const Icon = Icons[item.icon] ?? Icons.Circle;
                        const active = currentRoute.includes(item.route.split('.')[0]);
                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                ${active
                                    ? 'bg-signal text-navy shadow-sm'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                            >
                                <Icon size={18} strokeWidth={2} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* KYC status nudge — matches spec's "verify before applying" flow */}
                {kycStatus !== 'approved' && (
                    <div className="mx-3 mb-3 p-3 rounded-lg bg-signal/10 border border-signal/30">
                        <p className="text-xs text-signal font-medium leading-snug">
                            {kycStatus === 'pending'
                                ? 'Your verification is under review.'
                                : 'Verify your account to apply for grants.'}
                        </p>
                    </div>
                )}

                <div className="p-4 border-t border-white/10">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <Icons.LogOut size={18} />
                        Log out
                    </Link>
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-navy/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-navy" onClick={() => setSidebarOpen(true)}>
                            <Icons.Menu size={22} />
                        </button>
                        {header && <h1 className="font-display font-semibold text-navy text-lg">{header}</h1>}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-signal/20 text-signal flex items-center justify-center font-display font-semibold text-sm">
                        {auth.user.name?.charAt(0).toUpperCase()}
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}