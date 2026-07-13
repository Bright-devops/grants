import { useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';

export default function ApplicationsCreate({ plan }) {
    const { data, setData, post, processing, errors } = useForm({
        requested_amount: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applications.store', plan.id));
    };

    return (
        <UserLayout header={`Apply — ${plan.name}`}>
            <div className="max-w-lg mx-auto">
                <VoucherCard>
                    <p className="text-xs font-mono uppercase tracking-wider text-navy/50">
                        {plan.name} Plan
                    </p>
                    <p className="text-sm text-navy/60 mt-1">
                        You can request between{' '}
                        <span className="font-mono text-navy">${plan.minimum_amount}</span> and{' '}
                        <span className="font-mono text-navy">${plan.maximum_amount}</span>.
                    </p>

                    <form onSubmit={submit} className="mt-6">
                        <label className="block text-sm font-medium text-navy/70 mb-1">
                            Requested Amount ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min={plan.minimum_amount}
                            max={plan.maximum_amount}
                            value={data.requested_amount}
                            onChange={(e) => setData('requested_amount', e.target.value)}
                            className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                        />
                        {errors.requested_amount && (
                            <p className="text-status-rejected text-xs mt-1">{errors.requested_amount}</p>
                        )}

                        <p className="text-xs text-navy/40 mt-4">
                            A non-refundable application fee of{' '}
                            <span className="font-mono text-navy">${plan.application_fee}</span> is required
                            after submission to begin processing.
                        </p>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-4 bg-signal text-navy font-semibold text-sm py-2.5 rounded-lg hover:bg-signal-dark transition-colors disabled:opacity-50"
                        >
                            Submit Application
                        </button>
                    </form>
                </VoucherCard>
            </div>
        </UserLayout>
    );
}