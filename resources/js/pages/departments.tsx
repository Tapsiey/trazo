import { DataTable } from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatShortDate } from '@/lib/utils';
import { type BreadcrumbItem, type Department } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { FormEvent } from 'react';

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
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                                router.delete(route('departments.destroy', row.original.id));
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
    const { departments } = usePage<{ departments: Department[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <span></span>
                    <CreateDepartmentFrm />
                </div>

                <div className="my-8">
                    <DataTable data={departments} columns={columns} />
                </div>
            </div>
        </AppLayout>
    );
}

function CreateDepartmentFrm() {
    const { data, setData, post, processing } = useForm({
        name: '',
        description: '',
        code: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('departments.store'));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Code
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                className="col-span-3"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Name
                            </Label>
                            <Input id="name" name="name" className="col-span-3" onChange={(e) => setData('name', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Description
                            </Label>
                            <Textarea className="col-span-3" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose>
                            <Button disabled={processing} type="submit">
                                {processing ? 'Creating...' : 'Submit'}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
