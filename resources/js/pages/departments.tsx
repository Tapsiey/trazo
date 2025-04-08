import { DataTable } from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { formatShortDate } from '@/lib/utils';
import { type BreadcrumbItem, type Department } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/departments',
    },
];

const columns: ColumnDef<Department>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
    },
    {
        accessorKey: 'code',
        header: 'Code',
        enableSorting: true,
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            return <span>{formatShortDate(row.getValue('created_at'))}</span>;
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Modified',
        cell: ({ row }) => {
            return <span>{formatShortDate(row.getValue('updated_at'))}</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                            <MoreHorizontal />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
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
                    <DataTable data={departments} columns={columns} />
                </div>
            </div>
        </AppLayout>
    );
}
