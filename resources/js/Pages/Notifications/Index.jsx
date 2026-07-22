import { router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Bell, CheckCheck } from 'lucide-react';

export default function NotificationsIndex({ notifications }) {
    const markRead = (id) => {
        router.patch(route('notifications.mark-read', id), {}, { preserveScroll: true });
    };

    const markAllRead = () => {
        router.patch(route('notifications.mark-all-read'), {}, { preserveScroll: true });
    };

    return (
        <UserLayout header="Notifications">
            <div className="flex justify-end mb-6">
                <button
                    onClick={markAllRead}
                    className="flex items-center gap-2 text-sm font-medium text-navy/60 hover:text-navy"
                >
                    <CheckCheck size={16} /> Mark all as read
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <p className="text-navy/50 text-sm">No notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <VoucherCard
                            key={n.id}
                            className={!n.read_at ? 'ring-1 ring-signal/30' : ''}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                        !n.read_at ? 'bg-signal/10 text-signal' : 'bg-navy/5 text-navy/30'
                                    }`}
                                >
                                    <Bell size={16} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-navy text-sm">{n.data.title}</p>
                                        {!n.read_at && (
                                            <button
                                                onClick={() => markRead(n.id)}
                                                className="text-xs text-signal font-medium hover:text-signal-dark"
                                            >
                                                Mark read
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-navy/60 mt-1">{n.data.body}</p>
                                    <p className="text-xs text-navy/30 mt-2">
                                        {new Date(n.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </VoucherCard>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}