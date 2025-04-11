import { DataTable } from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { capitalize, formatShortDate } from '@/lib/utils';
import { UserResponse, type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manager Users',
        href: '/users',
    },
];

const columns: ColumnDef<UserResponse>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
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
        cell: ({ row }) => row.original.department?.name ?? 'N/A',
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
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
                            <CreateUserFrm />
                        </div>
                    </div>
                </div>

                <div className="my-8">
                    <DataTable data={users} columns={columns} />
                </div>
            </div>
        </AppLayout>
    );
}

function CreateUserFrm() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus />
                    Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Only create users with elevated privileges from here. For all other users, use the registration page
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" name="name" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" name="email" type="email" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Role
                        </Label>
                        <Select>
                            <SelectTrigger className="block w-full">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Department
                        </Label>
                        <Input id="email" name="email" type="email" className="col-span-3" required />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
