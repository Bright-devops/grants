import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save } from 'lucide-react';

const tabs = ['General', 'Branding', 'Social'];

export default function AdminSettingsIndex({ settings }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('General');

    const { data, setData, post, processing, errors } = useForm({
        company_name: settings.company_name,
        support_email: settings.support_email,
        phone: settings.phone,
        office_address: settings.office_address,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        facebook_url: settings.facebook_url,
        twitter_url: settings.twitter_url,
        instagram_url: settings.instagram_url,
        linkedin_url: settings.linkedin_url,
        logo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), { forceFormData: true, preserveScroll: true });
    };

    const inputClass = 'w-full rounded-lg border-navy/20 focus:border-signal focus:ring-signal text-sm';
    const labelClass = 'block text-sm font-medium text-navy/70 mb-1';

    return (
        <AdminLayout header="Settings">
            {flash?.success && (
                <div className="mb-6 bg-status-approved/10 text-status-approved text-sm font-medium px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="flex gap-1 mb-6 border-b border-navy/10">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            activeTab === tab
                                ? 'border-signal text-navy'
                                : 'border-transparent text-navy/40 hover:text-navy/70'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <form onSubmit={submit} className="bg-white rounded-xl p-6 shadow-sm max-w-xl space-y-4">
                {activeTab === 'General' && (
                    <>
                        <div>
                            <label className={labelClass}>Company Name</label>
                            <input type="text" value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} className={inputClass} />
                            {errors.company_name && <p className="text-status-rejected text-xs mt-1">{errors.company_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Support Email</label>
                            <input type="email" value={data.support_email} onChange={(e) => setData('support_email', e.target.value)} className={inputClass} />
                            {errors.support_email && <p className="text-status-rejected text-xs mt-1">{errors.support_email}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Office Address</label>
                            <textarea value={data.office_address} onChange={(e) => setData('office_address', e.target.value)} rows={3} className={inputClass} />
                        </div>
                    </>
                )}

                {activeTab === 'Branding' && (
                    <>
                        <div>
                            <label className={labelClass}>Logo</label>
                            {settings.logo_path && (
                                <img src={`/storage/${settings.logo_path}`} alt="Current logo" className="h-12 mb-2" />
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/svg+xml"
                                onChange={(e) => setData('logo', e.target.files[0])}
                                className="w-full text-sm text-navy/70 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-cloud file:text-navy file:text-sm"
                            />
                            {errors.logo && <p className="text-status-rejected text-xs mt-1">{errors.logo}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>SEO Title</label>
                            <input type="text" value={data.seo_title} onChange={(e) => setData('seo_title', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>SEO Description</label>
                            <textarea value={data.seo_description} onChange={(e) => setData('seo_description', e.target.value)} rows={3} className={inputClass} />
                        </div>
                    </>
                )}

                {activeTab === 'Social' && (
                    <>
                        <div>
                            <label className={labelClass}>Facebook URL</label>
                            <input type="url" value={data.facebook_url} onChange={(e) => setData('facebook_url', e.target.value)} className={inputClass} />
                            {errors.facebook_url && <p className="text-status-rejected text-xs mt-1">{errors.facebook_url}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Twitter / X URL</label>
                            <input type="url" value={data.twitter_url} onChange={(e) => setData('twitter_url', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Instagram URL</label>
                            <input type="url" value={data.instagram_url} onChange={(e) => setData('instagram_url', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>LinkedIn URL</label>
                            <input type="url" value={data.linkedin_url} onChange={(e) => setData('linkedin_url', e.target.value)} className={inputClass} />
                        </div>
                    </>
                )}

                <div className="pt-4 border-t border-navy/10">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-signal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-signal-dark disabled:opacity-50"
                    >
                        <Save size={16} /> Save Settings
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}