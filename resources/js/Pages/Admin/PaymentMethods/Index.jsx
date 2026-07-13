import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import Modal from '@/Components/Modal';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';

const typeFields = {
    crypto: ['wallet_address'],
    bank: ['bank_name', 'account_name', 'account_number', 'routing_number'],
    zelle: ['zelle_email'],
};

export default function PaymentMethodsIndex({ methods }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        type: 'crypto',
        name: '',
        wallet_address: '',
        bank_name: '',
        account_name: '',
        account_number: '',
        routing_number: '',
        zelle_email: '',
        status: 'active',
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setModalOpen(true);
    };

    const openEdit = (method) => {
        setEditing(method);
        setData({
            type: method.type,
            name: method.name,
            wallet_address: method.wallet_address ?? '',
            bank_name: method.bank_name ?? '',
            account_name: method.account_name ?? '',
            account_number: method.account_number ?? '',
            routing_number: method.routing_number ?? '',
            zelle_email: method.zelle_email ?? '',
            status: method.status,
        });
        clearErrors();
        setModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const options = { onSuccess: () => setModalOpen(false) };
        if (editing) {
            put(route('admin.payment-methods.update', editing.id), options);
        } else {
            post(route('admin.payment-methods.store'), options);
        }
    };

    const destroy = (method) => {
        if (confirm(`Delete "${method.name}"?`)) {
            router.delete(route('admin.payment-methods.destroy', method.id));
        }
    };

    const toggleStatus = (method) => {
        router.patch(route('admin.payment-methods.toggle-status', method.id));
    };

    return (
        <AdminLayout header="Payment Methods">
            <div className="flex justify-end mb-6">
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-signal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-signal-dark transition-colors"
                >
                    <Plus size={16} /> Add Method
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {methods.map((method) => (
                    <VoucherCard key={method.id}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-display font-bold text-navy">{method.name}</p>
                                <p className="text-xs text-navy/40 uppercase tracking-wide">{method.type}</p>
                            </div>
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    method.status === 'active'
                                        ? 'bg-status-approved/10 text-status-approved'
                                        : 'bg-navy/10 text-navy/50'
                                }`}
                            >
                                {method.status}
                            </span>
                        </div>

                        <div className="mt-3 text-xs font-mono text-navy/60 space-y-0.5">
                            {method.wallet_address && <p>{method.wallet_address}</p>}
                            {method.bank_name && <p>{method.bank_name}</p>}
                            {method.account_number && <p>Acct: {method.account_number}</p>}
                            {method.zelle_email && <p>{method.zelle_email}</p>}
                        </div>

                        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-navy/10">
                            <button onClick={() => openEdit(method)} className="flex items-center gap-1 text-xs font-medium text-navy/70 hover:text-navy">
                                <Pencil size={14} /> Edit
                            </button>
                            <button onClick={() => toggleStatus(method)} className="flex items-center gap-1 text-xs font-medium text-navy/70 hover:text-navy">
                                <Power size={14} /> {method.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => destroy(method)} className="flex items-center gap-1 text-xs font-medium text-status-rejected/80 hover:text-status-rejected ml-auto">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </VoucherCard>
                ))}
            </div>

            <Modal show={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <h2 className="font-display font-bold text-navy text-lg mb-4">
                        {editing ? 'Edit Payment Method' : 'New Payment Method'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Type</label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            >
                                <option value="crypto">Crypto</option>
                                <option value="bank">Bank</option>
                                <option value="zelle">Zelle</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="e.g. USDT (TRC20)"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            />
                            {errors.name && <p className="text-status-rejected text-xs mt-1">{errors.name}</p>}
                        </div>

                        {data.type === 'crypto' && (
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Wallet Address</label>
                                <input
                                    type="text"
                                    value={data.wallet_address}
                                    onChange={(e) => setData('wallet_address', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm font-mono"
                                />
                            </div>
                        )}

                        {data.type === 'bank' && (
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Bank Name" value={data.bank_name} onChange={(e) => setData('bank_name', e.target.value)} className="rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                                <input type="text" placeholder="Account Name" value={data.account_name} onChange={(e) => setData('account_name', e.target.value)} className="rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                                <input type="text" placeholder="Account Number" value={data.account_number} onChange={(e) => setData('account_number', e.target.value)} className="rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                                <input type="text" placeholder="Routing Number" value={data.routing_number} onChange={(e) => setData('routing_number', e.target.value)} className="rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                            </div>
                        )}

                        {data.type === 'zelle' && (
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1">Zelle Email</label>
                                <input
                                    type="email"
                                    value={data.zelle_email}
                                    onChange={(e) => setData('zelle_email', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                            </div>
                        )}

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
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-navy/60 hover:text-navy">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-signal text-navy text-sm font-semibold rounded-lg hover:bg-signal-dark disabled:opacity-50">
                            {editing ? 'Save Changes' : 'Add Method'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}