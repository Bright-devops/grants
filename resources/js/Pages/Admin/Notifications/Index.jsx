import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Send } from 'lucide-react';

export default function AdminNotificationsIndex({ users }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        target: 'all',
        user_ids: [],
    });

    const toggleUser = (id) => {
        setData('user_ids', data.user_ids.includes(id)
            ? data.user_ids.filter((u) => u !== id)
            : [...data.user_ids, id]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.notifications.send'), { onSuccess: () => reset() });
    };

    return (
        <AdminLayout header="Send Notification">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-navy/70 mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                        />
                        {errors.title && <p className="text-status-rejected text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-navy/70 mb-1">Message</label>
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                        />
                        {errors.body && <p className="text-status-rejected text-xs mt-1">{errors.body}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-navy/70 mb-1">Send to</label>
                        <select
                            value={data.target}
                            onChange={(e) => setData('target', e.target.value)}
                            className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                        >
                            <option value="all">All Users</option>
                            <option value="selected">Selected Users</option>
                        </select>
                    </div>

                    {data.target === 'selected' && (
                        <div className="max-h-48 overflow-y-auto border border-navy/10 rounded-lg p-3 space-y-1">
                            {users.map((u) => (
                                <label key={u.id} className="flex items-center gap-2 text-sm py-1">
                                    <input
                                        type="checkbox"
                                        checked={data.user_ids.includes(u.id)}
                                        onChange={() => toggleUser(u.id)}
                                        className="rounded border-navy/20 text-signal focus:ring-signal"
                                    />
                                    {u.name} <span className="text-navy/40">({u.email})</span>
                                </label>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-signal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-signal-dark disabled:opacity-50"
                    >
                        <Send size={16} /> Send Notification
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}