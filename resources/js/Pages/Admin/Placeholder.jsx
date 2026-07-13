import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPlaceholder({ title = 'Coming soon' }) {
    return (
        <AdminLayout header={title}>
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <p className="text-navy/50 font-mono text-sm">{title} — under construction</p>
            </div>
        </AdminLayout>
    );
}