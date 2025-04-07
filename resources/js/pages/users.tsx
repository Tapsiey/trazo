import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { capitalize, formatShortDate } from '@/lib/utils';
import { UserResponse, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus, UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manager Users',
        href: '/users',
    },
];

export default function Department() {
    const { users } = usePage<{ users: UserResponse[] }>().props;

    console.log(users);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <span></span>
                    <div className="flex items-center justify-between">
                        <span></span>
                        <div className="flex gap-3">
                            <Button variant="secondary">
                                <Plus />
                                New Role
                            </Button>
                            <Button>
                                <UserPlus />
                                Create
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="my-8">
                    <Table>
                        <TableHeader>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Created At</TableHead>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{capitalize(user.roles[0].name)}</TableCell>
                                    <TableCell>{user.department?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-right">{formatShortDate(user.created_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
