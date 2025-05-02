import { capitalize, formatDateTime } from '@/lib/utils';
import { Department, UserResponse } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { FileUser, MoreHorizontal } from 'lucide-react';
import { DataTable } from './DataTable/data-table';
import NewUserFrm from './new-user';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';


const columnHelper = createColumnHelper<UserResponse>();

const columns: ColumnDef<UserResponse, any>[] = [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: info => info.getValue(),
    }),
    columnHelper.display({
        header: 'Role',
        cell: ({ row }) => capitalize(row.original.roles[0]?.name) ?? 'No Role'
    }),
    columnHelper.display({
        header: 'Added On',
        cell: ({ row }) => formatDateTime(row.original.created_at)
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="data-[state=open]:bg-muted flex size-5 p-0">
                            <MoreHorizontal />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
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
        }
    }),
];

export default function AdminOverView({ users, roles, departments }: { users: UserResponse[], roles: string[], departments: Department[] }) {

    return (
        <div className="absolute inset-0 size-full">
            <div className="my-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    <FileUser className="text-secondary-foreground mr-2 inline" />
                    Users
                </h2>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        Add Role
                    </Button>
                    <NewUserFrm roles={roles} departments={departments} />
                </div>
            </div>
            <DataTable columns={columns} data={users} />
        </div>
    );
}

