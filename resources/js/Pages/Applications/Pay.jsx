import { useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';

export default function ApplicationsPay({ application, methods }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method_id: methods[0]?.id ?? '',
        transaction_hash: '',
        proof: null,
    });

    const selectedMethod = methods.find((m) => m.id == data.payment_method_id);

    const submit = (e) => {
        e.preventDefault();
        post(route('applications.pay.store', application.id), { forceFormData: true });
    };

    return (
        <UserLayout header={`Pay Application Fee — ${application.grant_plan.name}`}>
            <div className="max-w-lg mx-auto">
                <VoucherCard className="mb-6">
                    <p className="text-xs font-mono uppercase tracking-wider text-navy/50">Amount Due</p>
                    <p className="font-display text-2xl font-bold text-navy mt-1">
                        ${application.grant_plan.application_fee}
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
                            Submit Payment Proof
                        </button>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}