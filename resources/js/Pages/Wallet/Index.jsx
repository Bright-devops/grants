import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function WalletIndex({ wallet, transactions }) {
    return (
        <UserLayout header="Wallet">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">Balance</p>
                    <p className="font-display text-2xl font-bold text-navy mt-1">
                        ${wallet?.balance ?? '0.00'}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">Total Received</p>
                    <p className="font-display text-2xl font-bold text-status-approved mt-1">
                        ${wallet?.total_received ?? '0.00'}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">Total Withdrawn</p>
                    <p className="font-display text-2xl font-bold text-navy/60 mt-1">
                        ${wallet?.total_withdrawn ?? '0.00'}
                    </p>
                </div>
            </div>

            <h2 className="font-display font-semibold text-navy mb-4">Transaction History</h2>

            {transactions.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <p className="text-navy/50 text-sm">No transactions yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((tx) => (
                        <VoucherCard key={tx.id}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                            tx.type === 'credit'
                                                ? 'bg-status-approved/10 text-status-approved'
                                                : 'bg-status-rejected/10 text-status-rejected'
                                        }`}
                                    >
                                        {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-navy">
                                            {tx.description ?? (tx.type === 'credit' ? 'Wallet credit' : 'Wallet debit')}
                                        </p>
                                        <p className="text-xs font-mono text-navy/40">{tx.reference}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`font-mono font-medium ${
                                            tx.type === 'credit' ? 'text-status-approved' : 'text-status-rejected'
                                        }`}
                                    >
                                        {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                                    </p>
                                    <p className="text-xs text-navy/40">Balance: ${tx.balance_after}</p>
                                </div>
                            </div>
                        </VoucherCard>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}