import { Head } from '@inertiajs/react';
import { Star, Users } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function PublicTestimonials({ testimonials = [] }) {
    return (
        <PublicLayout>
            <Head title="Testimonials" />

            <div className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <span className="text-primary-700 text-xs font-semibold tracking-wide uppercase">Applicant experiences</span>
                    <h1 className="font-display text-3xl font-bold text-navy mt-3">What our applicants say</h1>
                    <p className="text-ink/60 mt-3 max-w-xl">Real stories from real grant recipients.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-14">
                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.id} className="border border-slate-200 rounded-xl p-6">
                                <div className="flex gap-0.5 mb-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < t.rating ? 'text-signal' : 'text-slate-200'}
                                            fill={i < t.rating ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                                <p className="text-ink/70 text-sm leading-relaxed">&ldquo;{t.message}&rdquo;</p>
                                <div className="flex items-center gap-3 mt-6">
                                    {t.photo_path ? (
                                        <img
                                            src={`/storage/${t.photo_path}`}
                                            alt={t.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-display font-semibold text-sm">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-navy text-sm">{t.name}</p>
                                        {t.country && <p className="text-xs text-ink/40">{t.country}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
                        <Users className="mx-auto text-navy/20" size={32} />
                        <p className="mt-4 text-ink/50 text-sm">No testimonials yet.</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
