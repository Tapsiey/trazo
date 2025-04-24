import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from '@/components/ui/badge';
import { DataTable } from "./DataTable/data-table";
import { statuses, formatShortDate } from "@/lib/utils";

export default function UserOverView({ documents }: { documents: Document[] }) {

    const columns: ColumnDef<Document>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                //@ts-expect-error
                <Link href={`/documents/${row.original.id}`} className="text-blue-500">
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
            cell: ({ row }) => <Badge variant="default">{row.original.category.toLowerCase()}</Badge>,
        },
        {
            accessorKey: 'updated_at',
            header: 'Uploaded',
            //@ts-expect-error
            cell: ({ row }) => formatShortDate(row.original.updated_at),
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
        }
    ];

    return (
        <div className="absolute inset-0 size-full">
            <DataTable data={documents} columns={columns} />
        </div>
    );
}