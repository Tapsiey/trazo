import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { capitalize, formatShortDate } from '@/lib/utils';
import { UserResponse } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { FileUser, MoreHorizontal, PlusCircle } from 'lucide-react';
import { DataTable } from './DataTable/data-table';
import { Button } from './ui/button';

export default function AdminOverView({ users }: { users: UserResponse[] }) {
    const columns: ColumnDef<UserResponse>[] = [
        {
            header: 'Name',
            accessorKey: 'name',
            enableSorting: true,
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            accessorKey: 'roles',
            id: 'role',
            header: 'Role',
            cell: ({ row }) => capitalize(row.original.roles[0]?.name) ?? 'No role',
        },
        {
            accessorKey: 'department',
            id: 'dept',
            header: 'Department',
            cell: ({ row }) => row.original.department?.name ?? 'Unassigned',
        },
        {
            accessorKey: 'updated_at',
            header: 'Last Modified',
            cell: ({ row }) => formatShortDate(row.original.updated_at),
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
                            <DropdownMenuItem>Export CSV</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => {
                                    router.delete(route('users.destroy', row.original.id));
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
    return (
        <div className="absolute inset-0 size-full">
            <div className="my-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    <FileUser className="text-secondary-foreground mr-2 inline" />
                    Users
                </h2>
                <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                        Add Role
                    </Button>
                    <NewUserFrm />
                </div>
            </div>
            <DataTable columns={columns} data={users} />
        </div>
    );
}

function NewUserFrm() {
    return (
        <Button size="sm">
            <PlusCircle />
            Create User
        </Button>
    );
}
