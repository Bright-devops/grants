import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import VoucherCard from '@/Components/VoucherCard';

function formatCurrency(value) {
    const number = Number(value);
    if (Number.isNaN(number)) return value;
    return number.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function PublicGrantPlans({ plans = [] }) {
    return (
        <PublicLayout>
            <Head title="Grant Plans" />

            <div className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <span className="text-primary-700 text-xs font-semibold tracking-wide uppercase">Grant plans</span>
                    <h1 className="font-display text-3xl font-bold text-navy mt-3">Choose the plan that fits your need</h1>
                    <p className="text-ink/60 mt-3 max-w-xl">
                        Every plan follows the same transparent review process. Compare funding ranges below,
                        then create an account to begin your application.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-14">
                {plans.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <VoucherCard key={plan.id}>
                                <p className="font-display font-bold text-navy text-xl">{plan.name}</p>
                                {plan.description && (
                                    <p className="text-sm text-navy/60 mt-2 leading-relaxed">{plan.description}</p>
                                )}
                                <div className="mt-5 space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-navy/50">Application fee</span>
                                        <span className="font-mono text-navy font-medium">
                                            ${formatCurrency(plan.application_fee)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-navy/50">Funding range</span>
                                        <span className="font-mono text-navy font-medium">
                                            ${formatCurrency(plan.minimum_amount)}–${formatCurrency(plan.maximum_amount)}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={route('register')}
                                    className="flex items-center justify-center gap-1.5 mt-6 bg-signal text-navy font-semibold text-sm py-2.5 rounded-lg hover:bg-signal-dark transition-colors"
                                >
                                    Get Started
                                    <ArrowRight size={15} />
                                </Link>
                            </VoucherCard>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
                        <ShieldCheck className="mx-auto text-navy/20" size={32} />
                        <p className="mt-4 text-ink/50 text-sm">
                            No grant plans are currently open. Please check back soon.
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
