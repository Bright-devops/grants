import AdminLayout from '@/Layouts/AdminLayout';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, ShieldCheck, Clock, CreditCard, ArrowDownToLine, Wallet, FileText } from 'lucide-react';

const statCards = [
    { key: 'total_users', label: 'Users', icon: Users },
    { key: 'verified_users', label: 'Verified Users', icon: ShieldCheck },
    { key: 'pending_kyc', label: 'Pending KYC', icon: Clock },
    { key: 'pending_payments', label: 'Pending Payments', icon: CreditCard },
    { key: 'pending_withdrawals', label: 'Pending Withdrawals', icon: ArrowDownToLine },
    { key: 'wallet_total', label: 'Wallet Total', icon: Wallet, prefix: '$' },
    { key: 'grant_applications', label: 'Grant Applications', icon: FileText },
];

function MiniChart({ title, data }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm font-medium text-navy/70 mb-3">{title}</p>
            <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262C5510" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#262C5580' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#262C5580' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #262C5520' }} />
                    <Line type="monotone" dataKey="count" stroke="#FB9129" strokeWidth={2} dot={{ r: 3, fill: '#FB9129' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function AdminDashboard({ stats, charts }) {
    return (
        <AdminLayout header="Admin Dashboard">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map(({ key, label, icon: Icon, prefix }) => (
                    <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-navy/40 mb-2">
                            <Icon size={14} />
                            <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
                        </div>
                        <p className="font-display text-xl font-bold text-navy">
                            {prefix}{stats[key]}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <MiniChart title="Registrations (6mo)" data={charts.registrations} />
                <MiniChart title="Funding Confirmed (6mo)" data={charts.funding} />
                <MiniChart title="Withdrawals Completed (6mo)" data={charts.withdrawals} />
            </div>
        </AdminLayout>
    );
}