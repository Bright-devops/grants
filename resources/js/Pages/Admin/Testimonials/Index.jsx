import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import VoucherCard from '@/Components/VoucherCard';
import Modal from '@/Components/Modal';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

export default function TestimonialsIndex({ testimonials }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        country: '',
        message: '',
        rating: 5,
        is_featured: false,
        photo: null,
        _method: 'post',
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setModalOpen(true);
    };

    const openEdit = (t) => {
        setEditing(t);
        setData({
            name: t.name,
            country: t.country ?? '',
            message: t.message,
            rating: t.rating,
            is_featured: t.is_featured,
            photo: null,
            _method: 'put',
        });
        clearErrors();
        setModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const options = { forceFormData: true, onSuccess: () => setModalOpen(false) };
        if (editing) {
            post(route('admin.testimonials.update', editing.id), options);
        } else {
            post(route('admin.testimonials.store'), options);
        }
    };

    const destroy = (t) => {
        if (confirm(`Delete testimonial from "${t.name}"?`)) {
            router.delete(route('admin.testimonials.destroy', t.id));
        }
    };

    const toggleFeatured = (t) => {
        router.patch(route('admin.testimonials.toggle-featured', t.id));
    };

    return (
        <AdminLayout header="Testimonials">
            <div className="flex justify-end mb-6">
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-signal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-signal-dark transition-colors"
                >
                    <Plus size={16} /> Add Testimonial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonials.map((t) => (
                    <VoucherCard key={t.id}>
                        <div className="flex items-start gap-3">
                            {t.photo_path ? (
                                <img
                                    src={`/storage/${t.photo_path}`}
                                    alt={t.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-signal/20 text-signal flex items-center justify-center font-display font-semibold text-sm">
                                    {t.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-display font-bold text-navy">{t.name}</p>
                                <p className="text-xs text-navy/40">{t.country}</p>
                            </div>
                        </div>

                        <div className="flex gap-0.5 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    className={i < t.rating ? 'fill-signal text-signal' : 'text-navy/15'}
                                />
                            ))}
                        </div>

                        <p className="text-sm text-navy/60 mt-3 line-clamp-3">{t.message}</p>

                        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-navy/10">
                            <button onClick={() => openEdit(t)} className="flex items-center gap-1 text-xs font-medium text-navy/70 hover:text-navy">
                                <Pencil size={14} /> Edit
                            </button>
                            <button
                                onClick={() => toggleFeatured(t)}
                                className={`flex items-center gap-1 text-xs font-medium ${
                                    t.is_featured ? 'text-signal' : 'text-navy/70 hover:text-navy'
                                }`}
                            >
                                <Star size={14} className={t.is_featured ? 'fill-signal' : ''} />
                                {t.is_featured ? 'Featured' : 'Feature'}
                            </button>
                            <button onClick={() => destroy(t)} className="flex items-center gap-1 text-xs font-medium text-status-rejected/80 hover:text-status-rejected ml-auto">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </VoucherCard>
                ))}

                {testimonials.length === 0 && (
                    <div className="col-span-full bg-white rounded-xl p-12 text-center shadow-sm">
                        <p className="text-navy/50 text-sm">No testimonials yet.</p>
                    </div>
                )}
            </div>

            <Modal show={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <h2 className="font-display font-bold text-navy text-lg mb-4">
                        {editing ? 'Edit Testimonial' : 'New Testimonial'}
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
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
                                <label className="block text-sm font-medium text-navy/70 mb-1">Country</label>
                                <input
                                    type="text"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Message</label>
                            <textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            />
                            {errors.message && <p className="text-status-rejected text-xs mt-1">{errors.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Rating</label>
                            <select
                                value={data.rating}
                                onChange={(e) => setData('rating', Number(e.target.value))}
                                className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm"
                            >
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1">Photo (optional)</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setData('photo', e.target.files[0])}
                                className="w-full text-sm text-navy/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-cloud file:text-navy file:text-sm"
                            />
                            {errors.photo && <p className="text-status-rejected text-xs mt-1">{errors.photo}</p>}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-navy/70">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="rounded border-navy/20 text-signal focus:ring-signal"
                            />
                            Feature on public site
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-navy/60 hover:text-navy">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-signal text-navy text-sm font-semibold rounded-lg hover:bg-signal-dark disabled:opacity-50">
                            {editing ? 'Save Changes' : 'Add Testimonial'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}