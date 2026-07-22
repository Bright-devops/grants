import PublicLayout from '@/Layouts/PublicLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Link } from '@inertiajs/react';

export default function PublicGrantPlans({ plans }) {
    return (
        <PublicLayout>
            <div className="max-w-6xl mx-auto px-6 py-16">
                <h1 className="font-display text-3xl font-bold text-navy mb-2">Grant Plans</h1>
                <p className="text-navy/60 mb-10">Choose the plan that fits your funding needs.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {plans.map((plan) => (
                        <VoucherCard key={plan.id}>
                            <p className="font-display font-bold text-navy text-xl">{plan.name}</p>
                            {plan.description && <p className="text-sm text-navy/60 mt-1">{plan.description}</p>}
                            <div className="mt-4 space-y-1 text-sm">
                                <p className="text-navy/60">
                                    Fee: <span className="font-mono text-navy font-medium">${plan.application_fee}</span>
                                </p>
                                <p className="text-navy/60">
                                    Range:{' '}
                                    <span className="font-mono text-navy font-medium">
                                        ${plan.minimum_amount}–${plan.maximum_amount}
                                    </span>
                                </p>
                            </div>
                            <Link
                                href={route('register')}
                                className="block text-center mt-5 bg-signal text-navy font-semibold text-sm py-2.5 rounded-lg hover:bg-signal-dark transition-colors"
                            >
                                Get Started
                            </Link>
                        </VoucherCard>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}