// resources/js/Layouts/PublicLayout.jsx
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import GoogleTranslate from '@/Components/GoogleTranslate';
import logo from '@/Pages/Public/images/logo.png';

const NAV_ITEMS = [
    { label: 'Home', routeName: 'home' },
    { label: 'About', routeName: 'about' },
    { label: 'Grant Plans', routeName: 'public.grant-plans' },
    { label: 'Testimonials', routeName: 'public.testimonials.index' },
    { label: 'FAQ', routeName: 'faq' },
    { label: 'Contact', routeName: 'contact.index' },
];

export default function PublicLayout({ children }) {
    const { settings, auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    const companyName = settings?.company_name ?? 'United Care Alliance (UCA)';

    const isActive = (routeName) => {
        try {
            return route().current(routeName);
        } catch {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-cloud flex flex-col">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-40 bg-navy text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href={route('home')} className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
                            {settings?.logo_path ? (
                                <img src={`/storage/${settings.logo_path}`} alt={companyName} className="h-8 w-auto" />
                            ) : (
                                <>
                                    <img src={logo} alt={companyName} className="h-8 w-auto brightness-0 invert" />
                                    <span className="font-display font-bold text-sm hidden sm:block">
                                        United Care Alliance
                                    </span>
                                </>
                            )}
                        </Link>

                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.routeName}
                                    href={route(item.routeName)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isActive(item.routeName)
                                            ? 'text-white bg-white/10'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="hidden lg:flex items-center gap-3">
                            <GoogleTranslate variant="dark" />
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-signal text-navy text-sm font-semibold px-4 py-2 rounded-lg hover:bg-signal-dark transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-medium text-white/80 hover:text-white px-2">
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-signal text-navy text-sm font-semibold px-4 py-2 rounded-lg hover:bg-signal-dark transition-colors"
                                    >
                                        Start Application
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-white/10"
                            aria-expanded={menuOpen}
                            aria-controls="public-mobile-menu"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div id="public-mobile-menu" className="lg:hidden border-t border-white/10 bg-navy">
                        <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.routeName}
                                    href={route(item.routeName)}
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-3 py-3 rounded-lg text-sm font-medium ${
                                        isActive(item.routeName) ? 'text-white bg-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-3">
                                <div className="px-1">
                                    <GoogleTranslate variant="dark" />
                                </div>

                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        onClick={() => setMenuOpen(false)}
                                        className="bg-signal text-navy text-sm font-semibold px-4 py-3 rounded-lg text-center"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            onClick={() => setMenuOpen(false)}
                                            className="text-sm font-medium text-white/80 px-3 py-2 text-center"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            onClick={() => setMenuOpen(false)}
                                            className="bg-signal text-navy text-sm font-semibold px-4 py-3 rounded-lg text-center"
                                        >
                                            Start Application
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-1">{children}</main>

            {/* ================= FOOTER ================= */}
            <footer className="bg-navy text-white/60">
                <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={logo} alt={companyName} className="h-7 w-auto brightness-0 invert" />
                        </div>
                        <p className="text-sm leading-relaxed">
                            Helping eligible individuals access transparent, verified funding through a secure application process.
                        </p>
                        <div className="flex gap-4 mt-5">
                            {settings?.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors">
                                    <FaFacebook size={16} />
                                </a>
                            )}
                            {settings?.twitter_url && (
                                <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors">
                                    <FaTwitter size={16} />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors">
                                    <FaInstagram size={16} />
                                </a>
                            )}
                            {settings?.linkedin_url && (
                                <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors">
                                    <FaLinkedin size={16} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-white font-display font-semibold text-sm mb-4">Company</p>
                        <ul className="space-y-3 text-sm">
                            <li><Link href={route('about')} className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href={route('public.grant-plans')} className="hover:text-white transition-colors">Grant Plans</Link></li>
                            <li><Link href={route('public.testimonials.index')} className="hover:text-white transition-colors">Testimonials</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-white font-display font-semibold text-sm mb-4">Support</p>
                        <ul className="space-y-3 text-sm">
                            <li><Link href={route('faq')} className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href={route('contact.index')} className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href={route('login')} className="hover:text-white transition-colors">Track an Application</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-white font-display font-semibold text-sm mb-4">Get in touch</p>
                        <ul className="space-y-3 text-sm">
                            {settings?.support_email && (
                                <li className="flex items-center gap-2">
                                    <Mail size={14} className="shrink-0 text-signal" />
                                    <span>{settings.support_email}</span>
                                </li>
                            )}
                            <li className="flex items-center gap-2">
                                <ShieldCheck size={14} className="shrink-0 text-signal" />
                                <span>Secure &amp; verified applications</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10">
                    <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
                        <div className="flex items-center gap-2 text-white/40">
                            <MapPin size={12} />
                            <span>Serving applicants across 140+ countries</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
