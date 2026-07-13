import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import Modal from '@/Components/Modal';
import { PlusCircle } from 'lucide-react';

export default function AdminWalletIndex({ wallets, totals }) {
    const { flash } = usePage().props;
    const [fundingWallet, setFundingWallet] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        description: '',
    });

    const openFund = (wallet) => {
        setFundingWallet(wallet);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.wallet.fund', fundingWallet.id), {
            onSuccess: () => setFundingWallet(null),
        });
    };

    return (
        <AdminLayout header="Wallets">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">Total Balance</p>
                    <p className="font-display text-2xl font-bold text-navy mt-1">${totals.balance}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">Total Received</p>
                    <p className="font-display text-2xl font-bold text-status-approved mt-1">${totals.received}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-medium text-navy/50 uppercase tracking-wide">Total Withdrawn</p>
                    <p className="font-display text-2xl font-bold text-navy/60 mt-1">${totals.withdrawn}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {wallets.map((wallet) => (
                    <VoucherCard key={wallet.id}>
                        <p className="font-display font-bold text-navy">{wallet.user.name}</p>
                        <p className="text-xs text-navy/50">{wallet.user.email}</p>

                        <div className="mt-3">
                            <p className="text-xs text-navy/40 uppercase tracking-wide">Balance</p>
                            <p className="font-mono text-xl text-navy font-medium">${wallet.balance}</p>
                        </div>

                        <div className="mt-3 flex gap-4 text-xs text-navy/50">
                            <span>Received: <span className="font-mono text-navy">${wallet.total_received}</span></span>
                            <span>Withdrawn: <span className="font-mono text-navy">${wallet.total_withdrawn}</span></span>
                        </div>

                        <button
                            onClick={() => openFund(wallet)}
                            className="flex items-center justify-center gap-2 w-full mt-4 pt-4 border-t border-navy/10 text-signal font-medium text-sm hover:text-signal-dark"
                        >
                            <PlusCircle size={16} /> Fund Wallet
                        </button>
                    </VoucherCard>
                ))}
            </div>

            <Modal show={!!fundingWallet} onClose={() => setFundingWallet(null)} maxWidth="sm">
                {fundingWallet && (
                    <form onSubmit={submit} className="p-6">
                        <h2 className="font-display font-bold text-navy text-lg mb-1">
                            Fund {fundingWallet.user.name}'s Wallet
                        </h2>
                        <p className="text-xs text-navy/50 mb-4">
                            Current balance: ${fundingWallet.balance}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                    autoFocus
                                />
                                {errors.amount && <p className="text-status-rejected text-xs mt-1">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Description (optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Grant disbursement"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={() => setFundingWallet(null)} className="px-4 py-2 text-sm font-medium text-navy/60 hover:text-navy">
                                Cancel
                            </button>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-signal text-navy text-sm font-semibold rounded-lg hover:bg-signal-dark disabled:opacity-50">
                                Fund Wallet
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </AdminLayout>
    );
}