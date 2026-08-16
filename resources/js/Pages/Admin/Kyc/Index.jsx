import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Check, X, Trash2, ImageOff } from 'lucide-react';

const statusStyles = {
    pending: 'bg-status-pending/10 text-status-pending',
    approved: 'bg-status-approved/10 text-status-approved',
    rejected: 'bg-status-rejected/10 text-status-rejected',
};

/**
 * A document thumbnail that falls back to a clean placeholder instead of a
 * broken-image icon if the file can't be loaded (deleted from disk, 403, etc).
 */
function DocumentThumb({ url, label }) {
    const [failed, setFailed] = useState(false);

    if (!url) return null;

    return (
        <a href={url} target="_blank" rel="noreferrer" className="block group">
            <div className="w-full aspect-square rounded-lg border border-navy/10 overflow-hidden bg-navy/5 flex items-center justify-center">
                {failed ? (
                    <div className="flex flex-col items-center gap-1 text-navy/30 px-2 text-center">
                        <ImageOff size={20} />
                        <span className="text-[10px] leading-tight">Couldn't load</span>
                    </div>
                ) : (
                    <img
                        src={url}
                        alt={label}
                        onError={() => setFailed(true)}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                )}
            </div>
            <p className="text-[11px] text-navy/40 mt-1 text-center">{label}</p>
        </a>
    );
}

export default function AdminKycIndex({ submissions }) {
    const { flash } = usePage().props;
    const [rejectingId, setRejectingId] = useState(null);
    const [reason, setReason] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');

    // Defensive guard: even though the backend now excludes KYC rows whose
    // user is missing/soft-deleted (whereHas('user') in KycController@index),
    // this filter is a second layer so one bad record can never crash the
    // whole admin page again, mirroring the same fix applied to Wallets.
    const validSubmissions = submissions.filter((kyc) => kyc.user);

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

    const submitDelete = (id) => {
        router.delete(route('admin.kyc.destroy', id), {
            data: { reason: deleteReason },
            onSuccess: () => {
                setDeletingId(null);
                setDeleteReason('');
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {validSubmissions.map((kyc) => (
                    <VoucherCard key={kyc.id}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="font-display font-bold text-navy">{kyc.user.name}</p>
                                <p className="text-xs text-navy/50">{kyc.user.email}</p>
                                <p className="text-xs font-mono text-navy/40 mt-1 capitalize">
                                    {kyc.document_type.replace('_', ' ')}
                                </p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize shrink-0 ${statusStyles[kyc.status]}`}>
                                {kyc.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <DocumentThumb url={kyc.document_front_url} label="Front" />
                            <DocumentThumb url={kyc.document_back_url} label="Back" />
                            <DocumentThumb url={kyc.selfie_url} label="Selfie" />
                        </div>

                        {kyc.status === 'rejected' && kyc.rejection_reason && (
                            <p className="text-xs text-status-rejected mb-3">Reason: {kyc.rejection_reason}</p>
                        )}

                        <div className="pt-3 border-t border-navy/10 space-y-3">
                            {kyc.status === 'pending' && (
                                rejectingId === kyc.id ? (
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
                                )
                            )}

                            {deletingId === kyc.id ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={deleteReason}
                                        onChange={(e) => setDeleteReason(e.target.value)}
                                        placeholder="Reason for deleting (optional)"
                                        className="flex-1 rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                    />
                                    <button
                                        onClick={() => submitDelete(kyc.id)}
                                        className="px-3 py-1.5 bg-status-rejected text-white text-xs font-medium rounded-lg"
                                    >
                                        Confirm delete
                                    </button>
                                    <button
                                        onClick={() => { setDeletingId(null); setDeleteReason(''); }}
                                        className="px-3 py-1.5 text-navy/50 text-xs font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setDeletingId(kyc.id)}
                                    className="flex items-center gap-1 text-navy/40 hover:text-status-rejected text-xs font-medium transition-colors"
                                >
                                    <Trash2 size={13} /> Delete submission
                                </button>
                            )}
                        </div>
                    </VoucherCard>
                ))}

                {validSubmissions.length === 0 && (
                    <div className="lg:col-span-2 bg-white rounded-xl p-12 text-center shadow-sm">
                        <p className="text-navy/50 text-sm">No KYC submissions yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}