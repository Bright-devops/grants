import { Link, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';
import { ShieldAlert } from 'lucide-react';

export default function GrantPlansIndex({ plans }) {
    const { auth, flash } = usePage().props;
    const kycStatus = auth.user.latest_kyc?.status ?? null;
    const kycApproved = kycStatus === 'approved';

    return (
        <UserLayout header="Grant Plans">
            {flash?.error && (
                <div className="mb-6 flex items-center gap-2 bg-status-rejected/10 text-status-rejected text-sm font-medium px-4 py-3 rounded-lg">
                    <ShieldAlert size={16} />
                    {flash.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {plans.map((plan) => (
                    <VoucherCard key={plan.id}>
                        <p className="font-display font-bold text-navy text-xl">{plan.name}</p>
                        {plan.description && (
                            <p className="text-sm text-navy/60 mt-1">{plan.description}</p>
                        )}

                        <div className="mt-4 space-y-1 text-sm">
                            <p className="text-navy/60">
                                Application fee:{' '}
                                <span className="font-mono text-navy font-medium">${plan.application_fee}</span>
                            </p>
                            <p className="text-navy/60">
                                Grant range:{' '}
                                <span className="font-mono text-navy font-medium">
                                    ${plan.minimum_amount} – ${plan.maximum_amount}
                                </span>
                            </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-navy/10">
                            {kycApproved ? (
                                <Link
                                    href={route('applications.create', plan.id)}
                                    className="block text-center bg-signal text-navy font-semibold text-sm py-2.5 rounded-lg hover:bg-signal-dark transition-colors"
                                >
                                    Apply Now
                                </Link>
                            ) : (
                                <p className="text-xs text-navy/40 text-center leading-snug">
                                    {kycStatus === 'pending'
                                        ? 'Verification under review — you can apply once approved.'
                                        : 'Verify your account to apply for this grant.'}
                                </p>
                            )}
                        </div>
                    </VoucherCard>
                ))}
            </div>
        </UserLayout>
    );
}