import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Mail } from 'lucide-react';

export default function EmailsIndex({ emails }) {
    return (
        <AdminLayout header="Emails">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-navy/10 text-left text-xs text-navy/40 uppercase tracking-wide">
                            <th className="px-5 py-3 font-medium">To</th>
                            <th className="px-5 py-3 font-medium">Subject</th>
                            <th className="px-5 py-3 font-medium">Sent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emails.map((email) => (
                            <tr key={email.id} className="border-b border-navy/5 last:border-0 hover:bg-cloud/50">
                                <td className="px-5 py-3 text-navy/70">{email.to_email}</td>
                                <td className="px-5 py-3">
                                    <Link
                                        href={route('admin.emails.show', email.id)}
                                        className="flex items-center gap-2 text-navy font-medium hover:text-signal"
                                    >
                                        <Mail size={14} className="text-navy/40" />
                                        {email.subject}
                                    </Link>
                                </td>
                                <td className="px-5 py-3 text-navy/40 text-xs">
                                    {new Date(email.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {emails.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-navy/50 text-sm">No emails sent yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}