import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, UserX, UserCheck, Trash2, ShieldCheck } from 'lucide-react';

const kycBadge = {
    approved: 'bg-status-approved/10 text-status-approved',
    pending: 'bg-status-pending/10 text-status-pending',
    rejected: 'bg-status-rejected/10 text-status-rejected',
    not_submitted: 'bg-navy/10 text-navy/40',
};

const kycLabel = {
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    not_submitted: 'Not submitted',
};

export default function AdminUsersIndex({ users }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    const suspend = (user) => {
        if (confirm(`Suspend ${user.name}? They won't be able to log in.`)) {
            router.patch(route('admin.users.suspend', user.id));
        }
    };

    const activate = (user) => {
        router.patch(route('admin.users.activate', user.id));
    };

    const destroy = (user) => {
        if (confirm(`Permanently delete ${user.name}? This cannot be undone.`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    const makeAdmin = (user) => {
        if (confirm(`Make ${user.name} an admin? They'll get full access to the admin panel.`)) {
            router.patch(route('admin.users.make-admin', user.id));
        }
    };

    const removeAdmin = (user) => {
        if (confirm(`Remove admin access from ${user.name}?`)) {
            router.patch(route('admin.users.remove-admin', user.id));
        }
    };

    return (
        <AdminLayout header="Users">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="relative mb-6 w-full max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[860px]">
                        <thead>
                            <tr className="border-b border-navy/10 text-left text-xs text-navy/40 uppercase tracking-wide">
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Country</th>
                                <th className="px-6 py-4 font-medium">KYC</th>
                                <th className="px-6 py-4 font-medium">Wallet</th>
                                <th className="px-6 py-4 font-medium">Apps</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => (
                                <tr key={user.id} className="border-b border-navy/5 last:border-0 hover:bg-cloud/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-navy">{user.name}</p>
                                            {user.is_admin && (
                                                <ShieldCheck size={14} className="text-signal shrink-0" title="Admin" />
                                            )}
                                        </div>
                                        <p className="text-xs text-navy/40 mt-0.5">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-navy/60 whitespace-nowrap">{user.country ?? '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${kycBadge[user.kyc_status]}`}>
                                            {kycLabel[user.kyc_status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-navy whitespace-nowrap">${user.wallet_balance}</td>
                                    <td className="px-6 py-4 text-navy/60">{user.applications_count}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${
                                                user.status === 'active'
                                                    ? 'bg-status-approved/10 text-status-approved'
                                                    : 'bg-status-rejected/10 text-status-rejected'
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end items-center gap-3">
                                            {user.is_admin ? (
                                                <button
                                                    onClick={() => removeAdmin(user)}
                                                    title="Remove Admin"
                                                    className="text-signal hover:text-signal-dark transition-colors"
                                                >
                                                    <ShieldCheck size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => makeAdmin(user)}
                                                    title="Make Admin"
                                                    className="text-navy/30 hover:text-signal transition-colors"
                                                >
                                                    <ShieldCheck size={16} />
                                                </button>
                                            )}

                                            {!user.is_admin && (
                                                <>
                                                    {user.status === 'active' ? (
                                                        <button
                                                            onClick={() => suspend(user)}
                                                            title="Suspend"
                                                            className="text-navy/50 hover:text-status-rejected transition-colors"
                                                        >
                                                            <UserX size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => activate(user)}
                                                            title="Reactivate"
                                                            className="text-navy/50 hover:text-status-approved transition-colors"
                                                        >
                                                            <UserCheck size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => destroy(user)}
                                                        title="Delete"
                                                        className="text-navy/50 hover:text-status-rejected transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-16 text-center">
                        <p className="text-navy/50 text-sm">No users found.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}