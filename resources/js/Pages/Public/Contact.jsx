import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Contact() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', subject: '', message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };

    return (
        <PublicLayout>
            <div className="max-w-xl mx-auto px-6 py-16">
                <h1 className="font-display text-3xl font-bold text-navy mb-2">Contact Us</h1>
                <p className="text-navy/60 mb-8">Have a question? Send us a message.</p>

                {flash?.success && (
                    <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-navy/70 mb-1">Name</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                        {errors.name && <p className="text-status-rejected text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-navy/70 mb-1">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                        {errors.email && <p className="text-status-rejected text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-navy/70 mb-1">Subject</label>
                        <input type="text" value={data.subject} onChange={(e) => setData('subject', e.target.value)} className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-navy/70 mb-1">Message</label>
                        <textarea value={data.message} onChange={(e) => setData('message', e.target.value)} rows={5} className="w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm" />
                        {errors.message && <p className="text-status-rejected text-xs mt-1">{errors.message}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="w-full bg-signal text-navy font-semibold text-sm py-2.5 rounded-lg hover:bg-signal-dark disabled:opacity-50">
                        Send Message
                    </button>
                </form>
            </div>
        </PublicLayout>
    );
}