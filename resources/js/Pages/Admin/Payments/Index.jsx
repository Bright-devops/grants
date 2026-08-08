import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Check, X, ImageOff } from 'lucide-react';

const statusStyles = {
    pending: 'bg-status-pending/10 text-status-pending',
    confirmed: 'bg-status-approved/10 text-status-approved',
    failed: 'bg-status-rejected/10 text-status-rejected',
};

function ProofThumb({ url }) {
    const [failed, setFailed] = useState(false);

    return (
        <a href={url} target="_blank" rel="noreferrer" className="block group">
            <div className="w-full aspect-square rounded-lg border border-navy/10 overflow-hidden bg-navy/5 flex items-center justify-center">
                {failed ? (
                    <div className="flex flex-col items-center gap-1 text-navy/30 px-2 text-center">
                        <ImageOff size={18} />
                        <span className="text-[10px] leading-tight">Couldn't load</span>
                    </div>
                ) : (
                    <img
                        src={url}
                        alt="Payment proof"
                        onError={() => setFailed(true)}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                )}
            </div>
        </a>
    );
}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {payments.map((p) => (
                    <VoucherCard key={p.id}>
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="min-w-0">
                                <p className="font-display font-bold text-navy truncate">{p.user.name}</p>
                                <p className="text-xs text-navy/50 truncate">{p.user.email}</p>
                            </div>
                            <span className={`text-[11px] font-medium px-2 py-1 rounded-full capitalize shrink-0 ${statusStyles[p.status]}`}>
                                {p.status}
                            </span>
                        </div>

                        <p className="text-xs font-mono text-navy/40 mb-1 truncate" title={`App: ${p.application_reference} · ${p.payment_method.name}`}>
                            {p.application_reference} · {p.payment_method.name}
                        </p>

                        <p className="text-sm text-navy/60 mb-3">
                            <span className="font-mono text-navy font-semibold">${p.amount}</span>
                        </p>

                        {p.transaction_hash && (
                            <p className="font-mono text-[10px] text-navy/40 mb-3 truncate" title={p.transaction_hash}>
                                {p.transaction_hash}
                            </p>
                        )}

                        <div className="mb-4">
                            <ProofThumb url={p.proof_url} />
                        </div>

                        {p.status === 'pending' && (
                            <div className="flex gap-2 pt-3 border-t border-navy/10">
                                <button onClick={() => confirm_(p.id)} className="flex items-center justify-center gap-1 flex-1 px-2 py-1.5 bg-status-approved text-white text-xs font-medium rounded-lg">
                                    <Check size={14} /> Confirm
                                </button>
                                <button onClick={() => reject(p.id)} className="flex items-center justify-center gap-1 flex-1 px-2 py-1.5 bg-status-rejected text-white text-xs font-medium rounded-lg">
                                    <X size={14} /> Reject
                                </button>
                            </div>
                        )}
                    </VoucherCard>
                ))}

                {payments.length === 0 && (
                    <div className="col-span-full bg-white rounded-xl p-12 text-center shadow-sm">
                        <p className="text-navy/50 text-sm">No payments yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}