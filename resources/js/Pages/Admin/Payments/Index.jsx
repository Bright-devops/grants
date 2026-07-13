import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Check, X } from 'lucide-react';

const statusStyles = {
    pending: 'bg-status-pending/10 text-status-pending',
    confirmed: 'bg-status-approved/10 text-status-approved',
    failed: 'bg-status-rejected/10 text-status-rejected',
};

export default function AdminPaymentsIndex({ payments }) {
    const { flash } = usePage().props;

    const confirm_ = (id) => {
        if (confirm('Confirm this payment?')) {
            router.patch(route('admin.payments.confirm', id));
        }
    };

    const reject = (id) => {
        if (confirm('Reject this payment?')) {
            router.patch(route('admin.payments.reject', id));
        }
    };

    return (
        <AdminLayout header="Payments">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="space-y-4">
                {payments.map((p) => (
                    <VoucherCard key={p.id}>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-display font-bold text-navy">{p.user.name}</p>
                                <p className="text-xs text-navy/50">{p.user.email}</p>
                                <p className="text-xs font-mono text-navy/40 mt-1">
                                    App: {p.application_reference} · {p.payment_method.name}
                                </p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusStyles[p.status]}`}>
                                {p.status}
                            </span>
                        </div>

                        <p className="text-sm text-navy/60 mb-3">
                            Amount: <span className="font-mono text-navy">${p.amount}</span>
                            {p.transaction_hash && <span className="ml-3 font-mono text-xs text-navy/40">{p.transaction_hash}</span>}
                        </p>

                        <a href={p.proof_url} target="_blank" rel="noreferrer">
                            <img src={p.proof_url} alt="Proof" className="w-32 h-32 object-cover rounded-lg border border-navy/10" />
                        </a>

                        {p.status === 'pending' && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-navy/10">
                                <button onClick={() => confirm_(p.id)} className="flex items-center gap-1 px-3 py-1.5 bg-status-approved text-white text-xs font-medium rounded-lg">
                                    <Check size={14} /> Confirm
                                </button>
                                <button onClick={() => reject(p.id)} className="flex items-center gap-1 px-3 py-1.5 bg-status-rejected text-white text-xs font-medium rounded-lg">
                                    <X size={14} /> Reject
                                </button>
                            </div>
                        )}
                    </VoucherCard>
                ))}

                {payments.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                        <p className="text-navy/50 text-sm">No payments yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}