// resources/js/Pages/Placeholder.jsx
import UserLayout from '@/Layouts/UserLayout';

export default function Placeholder({ title = 'Coming soon' }) {
    return (
        <UserLayout header={title}>
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <p className="text-navy/50 font-mono text-sm">{title} — under construction</p>
            </div>
        </UserLayout>
    );
}