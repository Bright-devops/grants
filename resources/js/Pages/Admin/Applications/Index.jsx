import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Check, X, Banknote, Trash2 } from 'lucide-react';

const statusStyles = {
    pending: 'bg-status-pending/10 text-status-pending',
    under_review: 'bg-signal/10 text-signal',
    approved: 'bg-status-approved/10 text-status-approved',
    rejected: 'bg-status-rejected/10 text-status-rejected',
    disbursed: 'bg-status-approved/10 text-status-approved',
};

export default function AdminApplicationsIndex({ applications }) {
    const { flash } = usePage().props;
    const [rejectingId, setRejectingId] = useState(null);
    const [reason, setReason] = useState('');

    const approve = (id) => {
        if (confirm('Approve this application?')) {
            router.patch(route('admin.applications.approve', id));
        }
    };

    const submitRejection = (id) => {
        if (!reason.trim()) return;
        router.patch(route('admin.applications.reject', id), { admin_notes: reason }, {
            onSuccess: () => {
                setRejectingId(null);
                setReason('');
            },
        });
    };

    const disburse = (id) => {
        if (confirm('Disburse this grant to the user\'s wallet?')) {
            router.patch(route('admin.applications.disburse', id));
        }
    };

    const destroy = (app) => {
        if (confirm(`Delete application ${app.reference}? This cannot be undone.`)) {
            router.delete(route('admin.applications.destroy', app.id));
        }
    };

    return (
        <AdminLayout header="Applications">
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

            <div className="space-y-4">
                {applications.map((app) => (
                    <VoucherCard key={app.id}>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-display font-bold text-navy">{app.user.name}</p>
                                <p className="text-xs text-navy/50">{app.user.email}</p>
                                <p className="text-xs font-mono text-navy/40 mt-1">
                                    {app.reference} · {app.grant_plan.name}
                                </p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusStyles[app.status]}`}>
                                {app.status.replace('_', ' ')}
                            </span>
                        </div>

                        <p className="text-sm text-navy/60 mb-1">
                            Requested: <span className="font-mono text-navy">${app.requested_amount}</span>
                        </p>
                        <p className="text-sm text-navy/60">
                            Payment:{' '}
                            <span className={`font-mono ${app.payment_status === 'confirmed' ? 'text-status-approved' : 'text-navy'}`}>
                                {app.payment_status.replace('_', ' ')}
                            </span>
                        </p>

                        {app.admin_notes && (
                            <p className="text-xs text-status-rejected mt-2">Note: {app.admin_notes}</p>
                        )}

                        <div className="flex gap-2 mt-4 pt-4 border-t border-navy/10 items-center">
                            {['pending', 'under_review'].includes(app.status) && app.payment_status === 'confirmed' && (
                                <>
                                    <button onClick={() => approve(app.id)} className="flex items-center gap-1 px-3 py-1.5 bg-status-approved text-white text-xs font-medium rounded-lg">
                                        <Check size={14} /> Approve
                                    </button>
                                    {rejectingId === app.id ? (
                                        <div className="flex gap-2 flex-1">
                                            <input
                                                type="text"
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder="Reason for rejection"
                                                className="flex-1 rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                            />
                                            <button onClick={() => submitRejection(app.id)} className="px-3 py-1.5 bg-status-rejected text-white text-xs font-medium rounded-lg">
                                                Confirm
                                            </button>
                                            <button onClick={() => setRejectingId(null)} className="px-3 py-1.5 text-navy/50 text-xs font-medium">
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setRejectingId(app.id)} className="flex items-center gap-1 px-3 py-1.5 bg-status-rejected text-white text-xs font-medium rounded-lg">
                                            <X size={14} /> Reject
                                        </button>
                                    )}
                                </>
                            )}
                            {['pending', 'under_review'].includes(app.status) && app.payment_status !== 'confirmed' && (
                                <p className="text-xs text-navy/40">Awaiting payment confirmation before review.</p>
                            )}
                            {app.status === 'approved' && (
                                <button onClick={() => disburse(app.id)} className="flex items-center gap-1 px-3 py-1.5 bg-signal text-navy text-xs font-medium rounded-lg">
                                    <Banknote size={14} /> Disburse Funds
                                </button>
                            )}
                            {app.status !== 'disbursed' && (
                                <button onClick={() => destroy(app)} className="flex items-center gap-1 px-3 py-1.5 text-status-rejected/70 hover:text-status-rejected text-xs font-medium ml-auto">
                                    <Trash2 size={14} /> Delete
                                </button>
                            )}
                        </div>
                    </VoucherCard>
                ))}

                {applications.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                        <p className="text-navy/50 text-sm">No applications yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}