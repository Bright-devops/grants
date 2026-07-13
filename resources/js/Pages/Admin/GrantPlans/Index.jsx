// resources/js/Pages/Admin/GrantPlans/Index.jsx
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import VoucherCard from '@/Components/VoucherCard';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';

export default function GrantPlansIndex({ plans }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        application_fee: '',
        minimum_amount: '',
        maximum_amount: '',
        status: 'active',
    });

    const openCreate = () => {
        setEditingPlan(null);
        reset();
        clearErrors();
        setModalOpen(true);
    };

    const openEdit = (plan) => {
        setEditingPlan(plan);
        setData({
            name: plan.name,
            description: plan.description ?? '',
            application_fee: plan.application_fee,
            minimum_amount: plan.minimum_amount,
            maximum_amount: plan.maximum_amount,
            status: plan.status,
        });
        clearErrors();
        setModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const options = { onSuccess: () => setModalOpen(false) };

        if (editingPlan) {
            put(route('admin.grant-plans.update', editingPlan.id), options);
        } else {
            post(route('admin.grant-plans.store'), options);
        }
    };

    const destroy = (plan) => {
        if (confirm(`Delete "${plan.name}"? This cannot be undone.`)) {
            router.delete(route('admin.grant-plans.destroy', plan.id));
        }
    };

    const toggleStatus = (plan) => {
        router.patch(route('admin.grant-plans.toggle-status', plan.id));
    };

    return (
        <AdminLayout header="Grant Plans">
            <div className="flex justify-end mb-6">
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-signal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-signal-dark transition-colors"
                >
                    <Plus size={16} /> Add Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {plans.map((plan) => (
                    <VoucherCard key={plan.id}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-display font-bold text-navy text-lg">{plan.name}</p>
                                <p className="text-xs font-mono text-navy/40 mt-0.5">/{plan.slug}</p>
                            </div>
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    plan.status === 'active'
                                        ? 'bg-status-approved/10 text-status-approved'
                                        : 'bg-navy/10 text-navy/50'
                                }`}
                            >
                                {plan.status}
                            </span>
                        </div>

                        <div className="mt-4 space-y-1 text-sm">
                            <p className="text-navy/60">
                                Fee: <span className="font-mono text-navy">${plan.application_fee}</span>
                            </p>
                            <p className="text-navy/60">
                                Range:{' '}
                                <span className="font-mono text-navy">
                                    ${plan.minimum_amount} – ${plan.maximum_amount}
                                </span>
                            </p>
                            <p className="text-navy/40 text-xs">{plan.applications_count} application(s)</p>
                        </div>

                        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-navy/10">
                            <button
                                onClick={() => openEdit(plan)}
                                className="flex items-center gap-1 text-xs font-medium text-navy/70 hover:text-navy"
                            >
                                <Pencil size={14} /> Edit
                            </button>
                            <button
                                onClick={() => toggleStatus(plan)}
                                className="flex items-center gap-1 text-xs font-medium text-navy/70 hover:text-navy"
                            >
                                <Power size={14} /> {plan.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => destroy(plan)}
                                className="flex items-center gap-1 text-xs font-medium text-status-rejected/80 hover:text-status-rejected ml-auto"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </VoucherCard>
                ))}
            </div>

            <Modal show={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <h2 className="font-display font-bold text-navy text-lg mb-4">
                        {editingPlan ? 'Edit Grant Plan' : 'New Grant Plan'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            />
                            {errors.name && <p className="text-status-rejected text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Fee ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.application_fee}
                                    onChange={(e) => setData('application_fee', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                                {errors.application_fee && (
                                    <p className="text-status-rejected text-xs mt-1">{errors.application_fee}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Min ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.minimum_amount}
                                    onChange={(e) => setData('minimum_amount', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                                {errors.minimum_amount && (
                                    <p className="text-status-rejected text-xs mt-1">{errors.minimum_amount}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Max ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.maximum_amount}
                                    onChange={(e) => setData('maximum_amount', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                                {errors.maximum_amount && (
                                    <p className="text-status-rejected text-xs mt-1">{errors.maximum_amount}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-navy/60 hover:text-navy"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-signal text-navy text-sm font-semibold rounded-lg hover:bg-signal-dark disabled:opacity-50"
                        >
                            {editingPlan ? 'Save Changes' : 'Create Plan'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}