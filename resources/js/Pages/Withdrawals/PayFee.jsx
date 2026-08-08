import { useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';

export default function WithdrawalsPayFee({ withdrawal, methods }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method_id: methods[0]?.id ?? '',
        transaction_hash: '',
        proof: null,
    });

    const selectedMethod = methods.find((m) => m.id == data.payment_method_id);

    const submit = (e) => {
        e.preventDefault();
        post(route('withdrawals.pay-fee.store', withdrawal.id), { forceFormData: true });
    };

    return (
        <UserLayout header="Pay Grant Fee to Continue Withdrawal">
            <div className="max-w-lg mx-auto">
                <div className="mb-6 bg-status-pending/10 text-status-pending text-sm px-4 py-3 rounded-lg">
                    Your withdrawal request <span className="font-mono font-medium">{withdrawal.reference}</span> for{' '}
                    <span className="font-mono font-medium">${withdrawal.amount}</span> is on hold. A grant fee wasn't
                    collected when your grant was disbursed, so it's due now before this withdrawal can be processed.
                    Pay the fee below and upload your proof of payment — once we confirm it, your withdrawal will be
                    released for processing automatically.
                </div>

                <VoucherCard className="mb-6">
                    <p className="text-xs font-mono uppercase tracking-wider text-navy/50">Fee Due</p>
                    <p className="font-display text-2xl font-bold text-navy mt-1">
                        ${withdrawal.fee_amount}
                    </p>
                </VoucherCard>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Payment Method</label>
                            <select
                                value={data.payment_method_id}
                                onChange={(e) => setData('payment_method_id', e.target.value)}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            >
                                {methods.map((m) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedMethod && (
                            <div className="bg-cloud rounded-lg p-4 text-sm font-mono text-navy space-y-1">
                                {selectedMethod.wallet_address && <p>Address: {selectedMethod.wallet_address}</p>}
                                {selectedMethod.bank_name && <p>Bank: {selectedMethod.bank_name}</p>}
                                {selectedMethod.account_name && <p>Name: {selectedMethod.account_name}</p>}
                                {selectedMethod.account_number && <p>Acct #: {selectedMethod.account_number}</p>}
                                {selectedMethod.routing_number && <p>Routing #: {selectedMethod.routing_number}</p>}
                                {selectedMethod.zelle_email && <p>Zelle: {selectedMethod.zelle_email}</p>}
                            </div>
                        )}

                        {selectedMethod?.type === 'crypto' && (
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Transaction Hash</label>
                                <input
                                    type="text"
                                    value={data.transaction_hash}
                                    onChange={(e) => setData('transaction_hash', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm font-mono"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">
                                Payment Receipt <span className="text-status-rejected">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setData('proof', e.target.files[0])}
                                className="w-full text-sm text-navy/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-cloud file:text-navy file:text-sm"
                            />
                            {errors.proof && <p className="text-status-rejected text-xs mt-1">{errors.proof}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-signal text-navy font-semibold text-sm py-2.5 rounded-lg hover:bg-signal-dark transition-colors disabled:opacity-50"
                        >
                            Submit Fee Payment Proof
                        </button>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
