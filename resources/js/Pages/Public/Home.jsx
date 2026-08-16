import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ShieldCheck,
    UserCheck,
    FileCheck2,
    Wallet,
    Star,
    Clock,
    Globe2,
    Lock,
    CircleDollarSign,
} from 'lucide-react';

import PublicLayout from '@/Layouts/PublicLayout';
import heroImage from './images/image-1.png';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const steps = [
    {
        icon: UserCheck,
        title: 'Create your account',
        text: 'Register in minutes and set up your applicant profile.',
    },
    {
        icon: ShieldCheck,
        title: 'Verify your identity',
        text: 'Complete a quick KYC check — most are reviewed within 24–48 hours.',
    },
    {
        icon: FileCheck2,
        title: 'Choose a plan & apply',
        text: 'Pick the grant plan that fits your need and submit your application.',
    },
    {
        icon: Wallet,
        title: 'Track & receive funds',
        text: 'Follow your status in real time and withdraw once approved.',
    },
];

const trustPoints = [
    { icon: Lock, label: 'Encrypted applications' },
    { icon: ShieldCheck, label: 'Identity-verified reviewers' },
    { icon: Clock, label: '24–48hr KYC turnaround' },
    { icon: Globe2, label: 'Available in 140+ countries' },
];

function formatCurrency(value) {
    const number = Number(value);
    if (Number.isNaN(number)) return value;
    return number.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function Home({ plans = [], testimonials = [] }) {
    return (
        <PublicLayout>
            <Head title="Home" />

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden bg-navy">
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary-900 opacity-95" />
                <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-14 items-center">
                    <motion.div initial="hidden" animate="show" variants={stagger}>
                        <motion.div
                            variants={fadeUp}
                            className="inline-flex items-center gap-2 bg-white/10 text-signal text-xs font-medium px-3.5 py-1.5 rounded-full mb-6"
                        >
                            <ShieldCheck size={13} />
                            Verified assistance programs
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="font-display text-white text-4xl sm:text-5xl font-bold leading-[1.1] max-w-lg"
                        >
                            Grant funding, without the guesswork
                        </motion.h1>

                        <motion.p variants={fadeUp} className="mt-6 text-white/70 text-lg leading-relaxed max-w-md">
                            United Care Alliance connects eligible individuals with verified assistance
                            programs through a transparent, secure application process — with clear status
                            updates at every stage.
                        </motion.p>

                        <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row gap-3">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center gap-2 bg-signal hover:bg-signal-dark transition-colors text-navy font-semibold px-6 py-3.5 rounded-lg"
                            >
                                Start Application
                                <ArrowRight size={17} />
                            </Link>
                            <Link
                                href={route('public.grant-plans')}
                                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors text-white font-semibold px-6 py-3.5 rounded-lg border border-white/15"
                            >
                                View Grant Plans
                            </Link>
                        </motion.div>

                        <motion.p variants={fadeUp} className="mt-6 text-white/40 text-xs">
                            No hidden fees. Applications reviewed by a verified team.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="relative"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <img src={heroImage} alt="United Care Alliance applicant support" className="w-full h-full object-cover" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= TRUST STRIP ================= */}
            <section className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-7 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {trustPoints.map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <item.icon size={18} className="text-primary-600 shrink-0" />
                            <span className="text-sm font-medium text-ink/80">{item.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="py-20 lg:py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="max-w-2xl mb-14"
                    >
                        <span className="text-primary-700 text-xs font-semibold tracking-wide uppercase">How it works</span>
                        <h2 className="font-display text-3xl font-bold text-navy mt-3">
                            Four steps from application to funding
                        </h2>
                        <p className="mt-4 text-ink/60 leading-relaxed">
                            Every applicant follows the same transparent path, so you always know what happens next.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {steps.map((step, i) => (
                            <motion.div key={step.title} variants={fadeUp} className="relative bg-white border border-slate-200 rounded-xl p-6">
                                <span className="absolute top-5 right-6 font-display text-3xl font-bold text-slate-100">
                                    0{i + 1}
                                </span>
                                <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-5">
                                    <step.icon size={20} className="text-primary-600" />
                                </div>
                                <h3 className="font-display font-semibold text-navy mb-2">{step.title}</h3>
                                <p className="text-sm text-ink/60 leading-relaxed">{step.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ================= GRANT PLANS ================= */}
            {plans.length > 0 && (
                <section className="py-20 lg:py-24 bg-white border-y border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
                        >
                            <div className="max-w-xl">
                                <span className="text-primary-700 text-xs font-semibold tracking-wide uppercase">Grant plans</span>
                                <h2 className="font-display text-3xl font-bold text-navy mt-3">
                                    Choose the plan that fits your need
                                </h2>
                            </div>
                            <Link
                                href={route('public.grant-plans')}
                                className="inline-flex items-center gap-1.5 text-navy font-semibold text-sm hover:text-primary-700 transition-colors shrink-0"
                            >
                                View all plans <ArrowRight size={15} />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.15 }}
                            variants={stagger}
                            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
                        >
                            {plans.map((plan) => (
                                <motion.div
                                    key={plan.id}
                                    variants={fadeUp}
                                    className="flex flex-col border border-slate-200 rounded-xl p-6 hover:border-navy/30 hover:shadow-md transition-all"
                                >
                                    <p className="font-display font-bold text-navy text-lg">{plan.name}</p>
                                    {plan.description && (
                                        <p className="text-sm text-ink/60 mt-2 leading-relaxed line-clamp-3">{plan.description}</p>
                                    )}

                                    <div className="mt-5 pt-5 border-t border-slate-100">
                                        <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">Funding range</p>
                                        <p className="font-mono font-semibold text-navy text-sm">
                                            ${formatCurrency(plan.minimum_amount)} – ${formatCurrency(plan.maximum_amount)}
                                        </p>
                                    </div>

                                    <Link
                                        href={route('register')}
                                        className="mt-6 text-center bg-navy hover:bg-navy/90 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                                    >
                                        Apply Now
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ================= WHY UCA ================= */}
            <section className="py-20 lg:py-24">
                <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                        <span className="text-primary-700 text-xs font-semibold tracking-wide uppercase">Why United Care Alliance</span>
                        <h2 className="font-display text-3xl font-bold text-navy mt-3 leading-tight">
                            Built so you always know where you stand
                        </h2>
                        <p className="mt-5 text-ink/60 leading-relaxed">
                            No back-and-forth phone calls or guessing games. Your application status, required
                            documents, and next steps live in one dashboard, reviewed against published criteria
                            for each program.
                        </p>

                        <div className="mt-8 grid sm:grid-cols-2 gap-4">
                            {[
                                'No application fee surprises',
                                'Reviewed against published criteria',
                                'Real-time status in your dashboard',
                                'Dedicated applicant support team',
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-2.5">
                                    <ShieldCheck size={17} className="text-primary-600 mt-0.5 shrink-0" />
                                    <span className="text-sm text-ink/70">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="bg-navy rounded-2xl p-8 lg:p-10"
                    >
                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { icon: CircleDollarSign, value: '$480M+', label: 'Distributed to applicants' },
                                { icon: Globe2, value: '140+', label: 'Countries reached' },
                                { icon: UserCheck, value: '98%', label: 'Applications verified' },
                                { icon: Clock, value: '21 days', label: 'Average review time' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <stat.icon size={20} className="text-signal mb-3" />
                                    <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-white/50 text-xs mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= TESTIMONIALS ================= */}
            {testimonials.length > 0 && (
                <section className="py-20 lg:py-24 bg-white border-y border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="max-w-2xl mb-12"
                        >
                            <span className="text-primary-700 text-xs font-semibold tracking-wide uppercase">Applicant experiences</span>
                            <h2 className="font-display text-3xl font-bold text-navy mt-3">What our applicants say</h2>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.15 }}
                            variants={stagger}
                            className="grid md:grid-cols-3 gap-6"
                        >
                            {testimonials.map((t) => (
                                <motion.div key={t.id} variants={fadeUp} className="border border-slate-200 rounded-xl p-6">
                                    <div className="flex gap-0.5 mb-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i < t.rating ? 'text-signal' : 'text-slate-200'}
                                                fill={i < t.rating ? 'currentColor' : 'none'}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-ink/70 text-sm leading-relaxed">&ldquo;{t.message}&rdquo;</p>
                                    <div className="flex items-center gap-3 mt-6">
                                        {t.photo_path ? (
                                            <img
                                                src={`/storage/${t.photo_path}`}
                                                alt={t.name}
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-display font-semibold text-sm">
                                                {t.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-navy text-sm">{t.name}</p>
                                            {t.country && <p className="text-xs text-ink/40">{t.country}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ================= FINAL CTA ================= */}
            <section className="py-20 lg:py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="bg-navy rounded-2xl px-8 py-14 lg:py-16 text-center"
                    >
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                            Ready to see if you qualify?
                        </h2>
                        <p className="mt-4 text-white/60 max-w-xl mx-auto leading-relaxed">
                            Most applicants receive a decision within 21 days. Create your account and start
                            your application today.
                        </p>
                        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center gap-2 bg-signal hover:bg-signal-dark transition-colors text-navy font-semibold px-7 py-3.5 rounded-lg"
                            >
                                Start Application
                                <ArrowRight size={17} />
                            </Link>
                            <Link
                                href={route('faq')}
                                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-3.5 rounded-lg border border-white/15 hover:bg-white/5 transition-colors"
                            >
                                Read the FAQ
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
