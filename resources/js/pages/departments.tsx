import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatShortDate } from '@/lib/utils';
import { type BreadcrumbItem, type Department } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/departments',
    },
];

export default function Department() {
    const { departments } = usePage<{ departments: Department[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <span></span>
                    <Button>
                        <Plus />
                        Create
                    </Button>
                </div>

                <div className="my-8">
                    <Table>
                        <TableCaption>A list of all your departments.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Last Modified</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell>{dept.name}</TableCell>
                                    <TableCell>{dept.code}</TableCell>
                                    <TableCell>{formatShortDate(dept.created_at)}</TableCell>
                                    <TableCell className="text-right">{formatShortDate(dept.updated_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
