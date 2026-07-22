import { useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';

export default function WithdrawalsCreate({ wallet }) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        method: 'crypto',
        wallet_address: '',
        bank_name: '',
        account_name: '',
        account_number: '',
        routing_number: '',
        zelle_email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('withdrawals.store'));
    };

    return (
        <UserLayout header="Request Withdrawal">
            <div className="max-w-lg mx-auto">
                <VoucherCard className="mb-6">
                    <p className="text-xs font-mono uppercase tracking-wider text-navy/50">Available Balance</p>
                    <p className="font-display text-2xl font-bold text-navy mt-1">${wallet?.balance ?? '0.00'}</p>
                </VoucherCard>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            />
                            {errors.amount && <p className="text-status-rejected text-xs mt-1">{errors.amount}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Method</label>
                            <select
                                value={data.method}
                                onChange={(e) => setData('method', e.target.value)}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            >
                                <option value="crypto">Crypto</option>
                                <option value="bank">Bank</option>
                                <option value="zelle">Zelle</option>
                            </select>
                        </div>

                        {data.method === 'crypto' && (
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Wallet Address</label>
                                <input
                                    type="text"
                                    value={data.wallet_address}
                                    onChange={(e) => setData('wallet_address', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm font-mono"
                                />
                                {errors.wallet_address && <p className="text-status-rejected text-xs mt-1">{errors.wallet_address}</p>}
                            </div>
                        )}

                        {data.method === 'bank' && (
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Bank Name" value={data.bank_name} onChange={(e) => setData('bank_name', e.target.value)} className="rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                                <input type="text" placeholder="Account Name" value={data.account_name} onChange={(e) => setData('account_name', e.target.value)} className="rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                                <input type="text" placeholder="Account Number" value={data.account_number} onChange={(e) => setData('account_number', e.target.value)} className="rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                                <input type="text" placeholder="Routing Number" value={data.routing_number} onChange={(e) => setData('routing_number', e.target.value)} className="rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                            </div>
                        )}

                        {data.method === 'zelle' && (
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Zelle Email</label>
                                <input
                                    type="email"
                                    value={data.zelle_email}
                                    onChange={(e) => setData('zelle_email', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                                {errors.zelle_email && <p className="text-status-rejected text-xs mt-1">{errors.zelle_email}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-signal text-navy font-semibold text-sm py-2.5 rounded-lg hover:bg-signal-dark transition-colors disabled:opacity-50"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}