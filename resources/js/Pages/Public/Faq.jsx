import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ChevronDown } from 'lucide-react';

const faqs = [
    { q: 'How do I apply for a grant?', a: 'Register an account, complete identity verification (KYC), then choose a grant plan and submit your application.' },
    { q: 'How long does KYC verification take?', a: 'Most verifications are reviewed within 24–48 hours.' },
    { q: 'What happens after I pay the application fee?', a: 'Your payment is reviewed by our team, and once confirmed, your application moves to the review stage.' },
    { q: 'How do I withdraw funds from my wallet?', a: 'Once your wallet has a balance, visit the Withdrawals page in your dashboard to request a payout via crypto, bank transfer, or Zelle.' },
];

export default function Faq() {
    const [open, setOpen] = useState(null);

    return (
        <PublicLayout>
            <div className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="font-display text-3xl font-bold text-navy mb-8">Frequently Asked Questions</h1>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left"
                            >
                                <span className="font-medium text-navy text-sm">{faq.q}</span>
                                <ChevronDown
                                    size={18}
                                    className={`text-navy/40 transition-transform ${open === i ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {open === i && (
                                <div className="px-5 pb-4 text-sm text-navy/60">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}