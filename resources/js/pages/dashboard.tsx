import AdminOverView from '@/components/admin-overview';
import UserOverView from '@/components/user-overview';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const {
        auth: { user },
    } = usePage<SharedData>().props;
    const { documents, users, usage } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
                        {/* @ts-expect-error */}
                        {usage.map((item) => (
                            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 border border-border shadow-xs sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <div className="relative min-h-[100vh] mt-8 flex-1 overflow-hidden md:min-h-min">
                    {/* @ts-expect-error */}
                    {user.role === 'user' ? <UserOverView documents={documents} /> : <AdminOverView users={users} />}
                </div>
            </div>
        </AppLayout>
    );
}
