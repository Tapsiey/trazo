import { DataTable } from '@/components/DataTable/data-table';
import { Badge } from '@/components/ui/badge';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatShortDate, statuses } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { FilePlus2, MoreHorizontal } from 'lucide-react';
import { type FormEvent } from 'react';

const columns: ColumnDef<Document>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <Link href="/" className="text-blue-500">
                {row.original.title}
            </Link>
        ),
    },
    {
        accessorKey: 'file_size',
        header: 'Size',
        //@ts-expect-error
        cell: ({ row }) => <span>{parseFloat(row.original.file_size / 1024).toFixed(2)} KB</span>,
    },
    {
        accessorKey: 'category',
        header: 'Category',
        //@ts-expect-error
        cell: ({ row }) => <Badge>{row.original.category.toLowerCase()}</Badge>,
    },
    {
        accessorKey: 'uploader',
        header: 'Submited By',
        //@ts-expect-error
        cell: ({ row }) => row.original.uploader.name,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = statuses.find((status) => status.value === row.getValue('status'));
            if (!status) {
                return null;
            }
            return (
                <div className="flex w-[100px] items-center">
                    {status.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                    <span>{status.label}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Modified',
        //@ts-expect-error
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
                        <DropdownMenuItem>Run Pipeline</DropdownMenuItem>
                        <DropdownMenuItem>Assign To</DropdownMenuItem>
                        <DropdownMenuItem>Mark Completed</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documents',
        href: '/documents',
    },
];

export default function Documents() {
    const { documents } = usePage<{ documents: Document[] }>().props;

    console.log(documents);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <span></span>
                    <div className="flex items-center justify-between">
                        <span></span>
                        <div className="flex gap-3">
                            <UploadDocumentFrm />
                        </div>
                    </div>
                </div>

                <div className="my-8">
                    <DataTable data={documents} columns={columns} />
                </div>
            </div>
        </AppLayout>
    );
}

function UploadDocumentFrm() {
    const { data, setData, post, processing } = useForm({
        title: '',
        description: '',
        file: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post('/documents/upload', {
            forceFormData: true, // Important for file uploads
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <FilePlus2 />
                    Upload
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
                                Title
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                className="col-span-3"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                File
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="file"
                                className="col-span-3"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                accept="application/pdf"
                                required
                            />
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
                                {processing ? 'Uploading...' : 'Upload Document'}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
