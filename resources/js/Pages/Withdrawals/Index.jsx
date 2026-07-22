import { Link, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Plus } from 'lucide-react';

const statusStyles = {
    pending: 'bg-status-pending/10 text-status-pending',
    processing: 'bg-signal/10 text-signal',
    completed: 'bg-status-approved/10 text-status-approved',
    rejected: 'bg-status-rejected/10 text-status-rejected',
};

export default function WithdrawalsIndex({ withdrawals, wallet }) {
    const { flash } = usePage().props;

    return (
        <UserLayout header="Withdrawals">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 bg-status-rejected/10 text-status-rejected text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.error}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-navy/60">
                    Available balance: <span className="font-mono text-navy font-medium">${wallet?.balance ?? '0.00'}</span>
                </p>
                <Link
                    href={route('withdrawals.create')}
                    className="flex items-center gap-2 bg-signal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-signal-dark transition-colors"
                >
                    <Plus size={16} /> Request Withdrawal
                </Link>
            </div>

            {withdrawals.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <p className="text-navy/50 text-sm">No withdrawal requests yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {withdrawals.map((w) => (
                        <VoucherCard key={w.id}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-mono text-sm text-navy">{w.reference}</p>
                                    <p className="text-xs text-navy/40 capitalize mt-0.5">{w.method}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-medium text-navy">${w.amount}</p>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[w.status]}`}>
                                        {w.status}
                                    </span>
                                </div>
                            </div>
                        </VoucherCard>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}