// resources/js/Pages/Applications/Index.jsx
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';
import { usePage, Link } from '@inertiajs/react';

const statusStyles = {
    pending: 'bg-status-pending/10 text-status-pending',
    under_review: 'bg-signal/10 text-signal',
    approved: 'bg-status-approved/10 text-status-approved',
    rejected: 'bg-status-rejected/10 text-status-rejected',
    disbursed: 'bg-status-approved/10 text-status-approved',
};

export default function ApplicationsIndex({ applications }) {
    const { flash } = usePage().props;

    return (
        <UserLayout header="My Applications">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            {applications.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <p className="text-navy/50 text-sm">
                        You haven't applied for any grants yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {applications.map((app) => (
                        <VoucherCard key={app.id}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-display font-bold text-navy text-lg">
                                        {app.grant_plan?.name ?? 'Grant Plan'}
                                    </p>
                                    <p className="text-xs font-mono text-navy/40 mt-0.5">
                                        {app.reference}
                                    </p>
                                </div>
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                                        statusStyles[app.status] ?? 'bg-navy/10 text-navy/50'
                                    }`}
                                >
                                    {app.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="mt-4 space-y-1 text-sm">
                                <p className="text-navy/60">
                                    Requested:{' '}
                                    <span className="font-mono text-navy">${app.requested_amount}</span>
                                </p>
                                <p className="text-navy/60">
                                    Payment:{' '}
                                    <span className="font-mono text-navy capitalize">
                                        {app.payment_status?.replace('_', ' ') ?? 'not paid'}
                                    </span>
                                </p>
                            </div>

                            {app.payment_status === 'not_paid' && (
                                <Link
                                    href={route('applications.pay', app.id)}
                                    className="block text-center mt-3 bg-signal text-navy font-semibold text-xs py-2 rounded-lg hover:bg-signal-dark transition-colors"
                                >
                                    Pay Application Fee
                                </Link>
                            )}
                        </VoucherCard>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}