import UserLayout from '@/Layouts/UserLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const isAdmin = auth.roles?.includes('admin');
    const Layout = isAdmin ? AdminLayout : UserLayout;

    return (
        <Layout header="Profile">
            <div className="space-y-6 max-w-2xl">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <UpdatePasswordForm />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <DeleteUserForm />
                </div>
            </div>
        </Layout>
    );
}