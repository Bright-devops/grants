// resources/js/Layouts/PublicLayout.jsx
import { Link, usePage } from '@inertiajs/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function PublicLayout({ children }) {
    const { settings, auth } = usePage().props;

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Grant Plans', href: '/grant-plans-public' },
        { label: 'Testimonials', href: '/testimonials' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <div className="min-h-screen bg-cloud">
            <header className="bg-navy text-white sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="font-display font-bold text-lg flex items-center gap-2">
                        {settings?.logo_path ? (
                            <img src={`/storage/${settings.logo_path}`} alt={settings.company_name} className="h-8" />
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-signal" />
                                {settings?.company_name ?? 'United Care Alliance (UCA)'}
                            </>
                        )}
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-signal text-navy text-sm font-semibold px-4 py-2 rounded-lg hover:bg-signal-dark transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-medium text-white/80 hover:text-white">
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-signal text-navy text-sm font-semibold px-4 py-2 rounded-lg hover:bg-signal-dark transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <footer className="bg-navy text-white/60 mt-20">
                <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <p className="font-display font-bold text-white text-lg mb-2">
                            {settings?.company_name ?? 'United Care Alliance (UCA)'}
                        </p>
                        <p className="text-sm">Helping people access the funding they need.</p>
                    </div>

                    <div>
                        <p className="text-white font-medium text-sm mb-2">Contact</p>
                        {settings?.support_email && <p className="text-sm">{settings.support_email}</p>}
                    </div>

                    <div>
                        <p className="text-white font-medium text-sm mb-2">Follow us</p>
                        <div className="flex gap-3">
                            {settings?.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="hover:text-signal">
                                    <FaFacebook size={18} />
                                </a>
                            )}
                            {settings?.twitter_url && (
                                <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="hover:text-signal">
                                    <FaTwitter size={18} />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-signal">
                                    <FaInstagram size={18} />
                                </a>
                            )}
                            {settings?.linkedin_url && (
                                <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-signal">
                                    <FaLinkedin size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 py-4 text-center text-xs">
                    © {new Date().getFullYear()} {settings?.company_name ?? 'United Care Alliance (UCA)'}. All rights reserved.
                </div>
            </footer>
        </div>
    );
}