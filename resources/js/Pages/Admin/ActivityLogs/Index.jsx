import AdminLayout from '@/Layouts/AdminLayout';
import { History } from 'lucide-react';

export default function ActivityLogsIndex({ logs }) {
    return (
        <AdminLayout header="Activity Logs">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-navy/10 text-left text-xs text-navy/40 uppercase tracking-wide">
                            <th className="px-5 py-3 font-medium">Action</th>
                            <th className="px-5 py-3 font-medium">By</th>
                            <th className="px-5 py-3 font-medium">Details</th>
                            <th className="px-5 py-3 font-medium">When</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} className="border-b border-navy/5 last:border-0">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <History size={14} className="text-signal" />
                                        <span className="font-mono text-xs text-navy">{log.action}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-navy/70">{log.user?.name ?? 'System'}</td>
                                <td className="px-5 py-3 text-navy/50 text-xs font-mono">
                                    {log.properties ? JSON.stringify(log.properties) : '—'}
                                </td>
                                <td className="px-5 py-3 text-navy/40 text-xs">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {logs.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-navy/50 text-sm">No activity recorded yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}