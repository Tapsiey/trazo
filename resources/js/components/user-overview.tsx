import { Badge } from '@/components/ui/badge';
import { formatDateTime, statuses } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { FilePlus2 } from 'lucide-react';
import { FormEvent } from 'react';
import { DataTable } from './DataTable/data-table';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const columnHelper = createColumnHelper<Document>();

const columns: ColumnDef<Document, any>[] = [
    columnHelper.accessor('title', {
        header: 'Name',
        cell: info => info.getValue(),
    }),
 
];

export default function UserOverView({ documents }: { documents: Document[] }) {


    return (
        <div className="absolute inset-0 size-full">
            <div className="my-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Documents</h2>
                <UploadDocumentFrm />
            </div>
            <DataTable data={documents} columns={columns} />
        </div>
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
                <Button size="sm">
                    <FilePlus2 />
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request Submission</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="name" className="mb-3 text-right">
                                Title
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                className="mt-1.5"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-right">
                                File
                            </Label>
                            <Input
                                className="mt-1.5"
                                id="email"
                                name="email"
                                type="file"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                accept="application/pdf"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Message</Label>
                            <Textarea className="mt-2" rows={5} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose>
                            <Button size="sm" disabled={processing} type="submit">
                                {processing ? 'Uploading...' : 'Upload Document'}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
