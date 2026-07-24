import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

export default function EmailShow({ email }) {
    return (
        <AdminLayout header="Email Detail">
            <Link
                href={route('admin.emails.index')}
                className="inline-flex items-center gap-1 text-sm text-navy/60 hover:text-navy mb-4"
            >
                <ArrowLeft size={14} /> Back to Emails
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-4 pb-4 border-b border-navy/10">
                    <p className="text-xs text-navy/40 uppercase tracking-wide">To</p>
                    <p className="text-navy font-medium">{email.to_email}</p>
                </div>
                <div className="mb-4 pb-4 border-b border-navy/10">
                    <p className="text-xs text-navy/40 uppercase tracking-wide">Subject</p>
                    <p className="text-navy font-medium">{email.subject}</p>
                </div>
                <div>
                    <p className="text-xs text-navy/40 uppercase tracking-wide mb-2">Body</p>
                    <div
                        className="prose prose-sm max-w-none border border-navy/10 rounded-lg p-4 bg-cloud"
                        dangerouslySetInnerHTML={{ __html: email.body }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}