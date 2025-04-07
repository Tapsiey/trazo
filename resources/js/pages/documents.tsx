import { DataTable } from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { FilePlus2 } from 'lucide-react';
import { type FormEvent } from 'react';

const columns: ColumnDef<Document>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'file_size',
        header: 'Size',
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
    const { data, setData, post, progress, processing, errors } = useForm({
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
                        <Button disabled={processing} type="submit">
                            {processing ? 'Uploading...' : 'Upload Document'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
