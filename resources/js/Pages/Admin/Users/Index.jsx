import { useState } from 'react';
import { router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { Search, UserX, UserCheck, Trash2, ShieldCheck, Pencil } from 'lucide-react';

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
    const [editingUser, setEditingUser] = useState(null);
    const [selected, setSelected] = useState([]);

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: '',
        username: '',
        email: '',
        country: '',
        whatsapp: '',
    });

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    // Admins can't be bulk-deleted (same rule as the single-delete action),
    // so they're excluded from "select all" and can't be checked individually.
    const selectableIds = filtered.filter((u) => !u.is_admin).map((u) => u.id);
    const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.includes(id));

    const toggleAll = () => {
        setSelected((prev) =>
            allSelected ? prev.filter((id) => !selectableIds.includes(id)) : Array.from(new Set([...prev, ...selectableIds]))
        );
    };

    const toggleOne = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const bulkDelete = () => {
        if (selected.length === 0) return;
        const count = selected.length;
        if (confirm(`Permanently delete ${count} user${count === 1 ? '' : 's'}? This cannot be undone.`)) {
            router.delete(route('admin.users.bulk-destroy'), {
                data: { ids: selected },
                onSuccess: () => setSelected([]),
            });
        }
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            username: user.username ?? '',
            email: user.email,
            country: user.country ?? '',
            whatsapp: user.whatsapp ?? '',
        });
        clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', editingUser.id), {
            onSuccess: () => setEditingUser(null),
        });
    };

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

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="relative w-full max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                    />
                </div>

                {selected.length > 0 && (
                    <div className="flex items-center gap-3 bg-navy/5 rounded-lg px-4 py-2.5">
                        <span className="text-sm font-medium text-navy">
                            {selected.length} selected
                        </span>
                        <button
                            onClick={bulkDelete}
                            className="flex items-center gap-1.5 text-sm font-semibold text-status-rejected hover:text-status-rejected/80 transition-colors"
                        >
                            <Trash2 size={15} />
                            Delete Selected
                        </button>
                        <button
                            onClick={() => setSelected([])}
                            className="text-sm text-navy/50 hover:text-navy transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead>
                            <tr className="border-b border-navy/10 text-left text-xs text-navy/40 uppercase tracking-wide">
                                <th className="pl-6 pr-2 py-4 font-medium w-10">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        disabled={selectableIds.length === 0}
                                        className="rounded border-navy/20 text-signal focus:ring-signal"
                                        aria-label="Select all users"
                                    />
                                </th>
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
                                <tr
                                    key={user.id}
                                    className={`border-b border-navy/5 last:border-0 hover:bg-cloud/50 transition-colors ${
                                        selected.includes(user.id) ? 'bg-signal/5' : ''
                                    }`}
                                >
                                    <td className="pl-6 pr-2 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(user.id)}
                                            onChange={() => toggleOne(user.id)}
                                            disabled={user.is_admin}
                                            className="rounded border-navy/20 text-signal focus:ring-signal disabled:opacity-30"
                                            aria-label={`Select ${user.name}`}
                                        />
                                    </td>
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
                                            <button
                                                onClick={() => openEdit(user)}
                                                title="Edit"
                                                className="text-navy/50 hover:text-navy transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>

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

            <Modal show={!!editingUser} onClose={() => setEditingUser(null)} maxWidth="md">
                {editingUser && (
                    <form onSubmit={submitEdit} className="p-6">
                        <h2 className="font-display font-bold text-navy text-lg mb-4">
                            Edit {editingUser.name}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                                {errors.name && <p className="text-status-rejected text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                                {errors.username && <p className="text-status-rejected text-xs mt-1">{errors.username}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                                {errors.email && <p className="text-status-rejected text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-navy/70 mb-1">Country</label>
                                    <input
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy/70 mb-1">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-sm font-medium text-navy/60 hover:text-navy"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-signal text-navy text-sm font-semibold rounded-lg hover:bg-signal-dark disabled:opacity-50"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </AdminLayout>
    );
}