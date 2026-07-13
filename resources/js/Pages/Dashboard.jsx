// resources/js/Pages/Dashboard.jsx
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';

export default function Dashboard({ wallet, applications }) {
    return (
        <UserLayout header="Dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">Wallet Balance</p>
                    <p className="font-display text-2xl font-bold text-navy mt-1">
                        ${wallet?.balance ?? '0.00'}
                    </p>
                </div>
                {/* repeat for Grant Status, KYC Status, Withdrawal Status */}
            </div>

            <VoucherCard>
                <p className="text-xs font-mono uppercase tracking-wider text-navy/50">Latest Application</p>
                <p className="font-mono text-lg text-navy font-medium">
                    {applications?.[0]?.reference ?? 'No applications yet'}
                </p>
            </VoucherCard>
        </UserLayout>
    );
}