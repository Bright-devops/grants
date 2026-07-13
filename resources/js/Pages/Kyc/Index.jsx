import { useForm, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';
import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

export default function KycIndex({ latestKyc }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        document_type: 'passport',
        document_front: null,
        document_back: null,
        selfie: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('kyc.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const showForm = !latestKyc || latestKyc.status === 'rejected';

    return (
        <UserLayout header="Identity Verification">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 bg-status-rejected/10 text-status-rejected text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.error}
                </div>
            )}

            {latestKyc?.status === 'approved' && (
                <VoucherCard className="mb-6">
                    <div className="flex items-center gap-3 text-status-approved">
                        <ShieldCheck size={22} />
                        <p className="font-display font-semibold">You're verified</p>
                    </div>
                    <p className="text-sm text-navy/60 mt-1">
                        Your identity has been confirmed. You can now apply for any grant plan.
                    </p>
                </VoucherCard>
            )}

            {latestKyc?.status === 'pending' && (
                <VoucherCard className="mb-6">
                    <div className="flex items-center gap-3 text-signal">
                        <Clock size={22} />
                        <p className="font-display font-semibold">Under review</p>
                    </div>
                    <p className="text-sm text-navy/60 mt-1">
                        We've received your documents and they're being reviewed. This usually takes 24–48 hours.
                    </p>
                </VoucherCard>
            )}

            {latestKyc?.status === 'rejected' && (
                <VoucherCard className="mb-6">
                    <div className="flex items-center gap-3 text-status-rejected">
                        <ShieldAlert size={22} />
                        <p className="font-display font-semibold">Verification rejected</p>
                    </div>
                    <p className="text-sm text-navy/60 mt-1">{latestKyc.rejection_reason}</p>
                    <p className="text-xs text-navy/40 mt-2">Please resubmit with corrected documents below.</p>
                </VoucherCard>
            )}

            {showForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm max-w-lg">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Document Type</label>
                            <select
                                value={data.document_type}
                                onChange={(e) => setData('document_type', e.target.value)}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            >
                                <option value="passport">Passport</option>
                                <option value="national_id">National ID</option>
                                <option value="drivers_license">Driver's License</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">
                                Document Front <span className="text-status-rejected">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setData('document_front', e.target.files[0])}
                                className="w-full text-sm text-navy/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-cloud file:text-navy file:text-sm"
                            />
                            {errors.document_front && (
                                <p className="text-status-rejected text-xs mt-1">{errors.document_front}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">
                                Document Back (optional)
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setData('document_back', e.target.files[0])}
                                className="w-full text-sm text-navy/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-cloud file:text-navy file:text-sm"
                            />
                            {errors.document_back && (
                                <p className="text-status-rejected text-xs mt-1">{errors.document_back}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Selfie (optional)</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setData('selfie', e.target.files[0])}
                                className="w-full text-sm text-navy/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-cloud file:text-navy file:text-sm"
                            />
                            {errors.selfie && <p className="text-status-rejected text-xs mt-1">{errors.selfie}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-signal text-navy font-semibold text-sm py-2.5 rounded-lg hover:bg-signal-dark transition-colors disabled:opacity-50"
                        >
                            Submit for Verification
                        </button>
                    </form>
                </div>
            )}
        </UserLayout>
    );
}