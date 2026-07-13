import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Check, X } from 'lucide-react';

const statusStyles = {
    pending: 'bg-status-pending/10 text-status-pending',
    approved: 'bg-status-approved/10 text-status-approved',
    rejected: 'bg-status-rejected/10 text-status-rejected',
};

export default function AdminKycIndex({ submissions }) {
    const { flash } = usePage().props;
    const [rejectingId, setRejectingId] = useState(null);
    const [reason, setReason] = useState('');

    const approve = (id) => {
        if (confirm('Approve this KYC submission?')) {
            router.patch(route('admin.kyc.approve', id));
        }
    };

    const submitRejection = (id) => {
        if (!reason.trim()) return;
        router.patch(route('admin.kyc.reject', id), { rejection_reason: reason }, {
            onSuccess: () => {
                setRejectingId(null);
                setReason('');
            },
        });
    };

    return (
        <AdminLayout header="KYC Review">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="space-y-4">
                {submissions.map((kyc) => (
                    <VoucherCard key={kyc.id}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="font-display font-bold text-navy">{kyc.user.name}</p>
                                <p className="text-xs text-navy/50">{kyc.user.email}</p>
                                <p className="text-xs font-mono text-navy/40 mt-1 capitalize">
                                    {kyc.document_type.replace('_', ' ')}
                                </p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusStyles[kyc.status]}`}>
                                {kyc.status}
                            </span>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <a href={kyc.document_front_url} target="_blank" rel="noreferrer">
                                <img src={kyc.document_front_url} alt="Front" className="w-24 h-24 object-cover rounded-lg border border-navy/10" />
                            </a>
                            {kyc.document_back_url && (
                                <a href={kyc.document_back_url} target="_blank" rel="noreferrer">
                                    <img src={kyc.document_back_url} alt="Back" className="w-24 h-24 object-cover rounded-lg border border-navy/10" />
                                </a>
                            )}
                            {kyc.selfie_url && (
                                <a href={kyc.selfie_url} target="_blank" rel="noreferrer">
                                    <img src={kyc.selfie_url} alt="Selfie" className="w-24 h-24 object-cover rounded-lg border border-navy/10" />
                                </a>
                            )}
                        </div>

                        {kyc.status === 'rejected' && kyc.rejection_reason && (
                            <p className="text-xs text-status-rejected mb-3">Reason: {kyc.rejection_reason}</p>
                        )}

                        {kyc.status === 'pending' && (
                            <div className="pt-3 border-t border-navy/10">
                                {rejectingId === kyc.id ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Reason for rejection"
                                            className="flex-1 rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                        />
                                        <button
                                            onClick={() => submitRejection(kyc.id)}
                                            className="px-3 py-1.5 bg-status-rejected text-white text-xs font-medium rounded-lg"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => setRejectingId(null)}
                                            className="px-3 py-1.5 text-navy/50 text-xs font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => approve(kyc.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-status-approved text-white text-xs font-medium rounded-lg"
                                        >
                                            <Check size={14} /> Approve
                                        </button>
                                        <button
                                            onClick={() => setRejectingId(kyc.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-status-rejected text-white text-xs font-medium rounded-lg"
                                        >
                                            <X size={14} /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </VoucherCard>
                ))}

                {submissions.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                        <p className="text-navy/50 text-sm">No KYC submissions yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}