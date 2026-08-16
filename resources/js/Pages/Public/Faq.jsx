import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

const faqs = [
    { q: 'How do I apply for a grant?', a: 'Register an account, complete identity verification (KYC), then choose a grant plan and submit your application.' },
    { q: 'How long does KYC verification take?', a: 'Most verifications are reviewed within 24–48 hours.' },
    { q: 'What happens after I pay the application fee?', a: 'Your payment is reviewed by our team, and once confirmed, your application moves to the review stage.' },
    { q: 'How do I withdraw funds from my wallet?', a: 'Once your wallet has a balance, visit the Withdrawals page in your dashboard to request a payout via crypto, bank transfer, or Zelle.' },
    { q: 'Is there an application fee?', a: 'Application fees vary by grant plan and are shown before you apply. Fees fund verification and processing costs.' },
    { q: 'Is my personal information secure?', a: 'Yes. Applications are encrypted and reviewed only by verified team members under our privacy policy.' },
];

export default function Faq() {
    const [open, setOpen] = useState(0);

    return (
        <PublicLayout>
            <Head title="FAQ" />

            <div className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <span className="text-primary-700 text-xs font-semibold tracking-wide uppercase">Support</span>
                    <h1 className="font-display text-3xl font-bold text-navy mt-3">Frequently Asked Questions</h1>
                    <p className="text-ink/60 mt-3 max-w-xl">Everything you need to know before you apply.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-14">
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={faq.q} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                                aria-expanded={open === i}
                            >
                                <span className="font-medium text-navy text-sm">{faq.q}</span>
                                <ChevronDown
                                    size={18}
                                    className={`shrink-0 text-navy/40 transition-transform ${open === i ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {open === i && (
                                <div className="px-5 pb-4 text-sm text-ink/60 leading-relaxed">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-10 bg-navy rounded-xl p-8 text-center">
                    <p className="text-white font-display font-semibold text-lg">Still have questions?</p>
                    <p className="text-white/60 text-sm mt-2">Our support team is happy to help.</p>
                    <Link
                        href={route('contact.index')}
                        className="inline-flex items-center justify-center gap-2 mt-5 bg-signal hover:bg-signal-dark transition-colors text-navy font-semibold px-6 py-3 rounded-lg text-sm"
                    >
                        Contact Us
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
