import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Check, X, Banknote } from 'lucide-react';

const statusStyles = {
    pending: 'bg-status-pending/10 text-status-pending',
    processing: 'bg-signal/10 text-signal',
    completed: 'bg-status-approved/10 text-status-approved',
    rejected: 'bg-status-rejected/10 text-status-rejected',
};

export default function AdminWithdrawalsIndex({ withdrawals }) {
    const { flash } = usePage().props;

    const approve = (id) => {
        if (confirm('Approve this withdrawal and move it to processing?')) {
            router.patch(route('admin.withdrawals.approve', id));
        }
    };

    const markPaid = (id) => {
        if (confirm('Mark as paid? This will generate an invoice.')) {
            router.patch(route('admin.withdrawals.mark-paid', id));
        }
    };

    const reject = (id) => {
        if (confirm('Reject this withdrawal? The funds will be refunded to the user.')) {
            router.patch(route('admin.withdrawals.reject', id));
        }
    };

    return (
        <AdminLayout header="Withdrawals">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="space-y-4">
                {withdrawals.map((w) => (
                    <VoucherCard key={w.id}>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-display font-bold text-navy">{w.user.name}</p>
                                <p className="text-xs text-navy/50">{w.user.email}</p>
                                <p className="text-xs font-mono text-navy/40 mt-1">{w.reference}</p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusStyles[w.status]}`}>
                                {w.status}
                            </span>
                        </div>

                        <p className="text-sm text-navy/60 mb-1">
                            Amount: <span className="font-mono text-navy">${w.amount}</span> via{' '}
                            <span className="capitalize">{w.method}</span>
                        </p>

                        <div className="text-xs font-mono text-navy/50 bg-cloud rounded-lg p-3 mt-2">
                            {Object.entries(w.destination_details).map(([key, value]) => (
                                <p key={key}>{key.replace('_', ' ')}: {value}</p>
                            ))}
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-navy/10">
                            {w.status === 'pending' && (
                                <>
                                    <button onClick={() => approve(w.id)} className="flex items-center gap-1 px-3 py-1.5 bg-signal text-navy text-xs font-medium rounded-lg">
                                        <Check size={14} /> Approve
                                    </button>
                                    <button onClick={() => reject(w.id)} className="flex items-center gap-1 px-3 py-1.5 bg-status-rejected text-white text-xs font-medium rounded-lg">
                                        <X size={14} /> Reject
                                    </button>
                                </>
                            )}
                            {w.status === 'processing' && (
                                <button onClick={() => markPaid(w.id)} className="flex items-center gap-1 px-3 py-1.5 bg-status-approved text-white text-xs font-medium rounded-lg">
                                    <Banknote size={14} /> Mark as Paid
                                </button>
                            )}
                        </div>
                    </VoucherCard>
                ))}

                {withdrawals.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                        <p className="text-navy/50 text-sm">No withdrawal requests yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}