import { Head, useForm, usePage } from '@inertiajs/react';
import { Mail, CheckCircle2 } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Contact() {
    const { flash, settings } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', subject: '', message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };

    return (
        <PublicLayout>
            <Head title="Contact" />

            <div className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <span className="text-primary-700 text-xs font-semibold tracking-wide uppercase">Support</span>
                    <h1 className="font-display text-3xl font-bold text-navy mt-3">Contact Us</h1>
                    <p className="text-ink/60 mt-3 max-w-xl">Have a question about your application? Send us a message.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-14 grid lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2">
                    <h2 className="font-display font-semibold text-navy text-lg mb-3">Get in touch</h2>
                    <p className="text-sm text-ink/60 leading-relaxed mb-6">
                        We typically respond within one business day. For urgent application issues, sign in
                        and use the support option on your dashboard.
                    </p>
                    {settings?.support_email && (
                        <div className="flex items-center gap-3 text-sm text-ink/70">
                            <Mail size={16} className="text-primary-600" />
                            {settings.support_email}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3">
                    {flash?.success && (
                        <div className="mb-6 flex items-center gap-2 bg-success-50 text-success-700 text-sm font-medium px-4 py-3 rounded-lg">
                            <CheckCircle2 size={16} />
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 focus:border-navy focus:ring-navy text-sm"
                                />
                                {errors.name && <p className="text-danger-600 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 focus:border-navy focus:ring-navy text-sm"
                                />
                                {errors.email && <p className="text-danger-600 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1.5">Subject</label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                className="w-full rounded-lg border-slate-200 focus:border-navy focus:ring-navy text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1.5">Message</label>
                            <textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows={5}
                                className="w-full rounded-lg border-slate-200 focus:border-navy focus:ring-navy text-sm"
                            />
                            {errors.message && <p className="text-danger-600 text-xs mt-1">{errors.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-signal text-navy font-semibold text-sm py-3 rounded-lg hover:bg-signal-dark disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Sending…' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
