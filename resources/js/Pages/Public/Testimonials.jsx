import { Head, Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import GoogleTranslate from '@/Components/GoogleTranslate';

export default function PublicTestimonials({ testimonials }) {
    return (
        <>
            <Head title="Testimonials" />
            <div className="min-h-screen bg-cloud">
                <header className="bg-navy text-white">
                    <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
                        <Link href="/" className="font-display font-bold text-lg">
                            Grant<span className="text-signal">Portal</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <GoogleTranslate variant="dark" />
                            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white">
                                Log in
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-6 py-12">
                    <h1 className="font-display text-3xl font-bold text-navy mb-2">What our recipients say</h1>
                    <p className="text-navy/60 mb-10">Real stories from real grant recipients.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex gap-0.5 mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
    key={i}
    size={14}
    className={i < t.rating ? 'text-signal' : 'text-navy/15'}
    fill={i < t.rating ? 'currentColor' : 'none'}
/>
                                    ))}
                                </div>
                                <p className="text-navy/70 text-sm leading-relaxed">"{t.message}"</p>
                                <div className="flex items-center gap-3 mt-5">
                                    {t.photo_path ? (
                                        <img src={`/storage/${t.photo_path}`} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-signal/20 text-signal flex items-center justify-center font-display font-semibold text-sm">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-navy text-sm">{t.name}</p>
                                        <p className="text-xs text-navy/40">{t.country}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {testimonials.length === 0 && (
                            <p className="text-navy/40 text-sm col-span-full">No testimonials yet.</p>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}