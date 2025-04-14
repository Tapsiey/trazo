import PDFViewer from '@/components/pdf-viewer';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Tracking',
        href: '/documents',
    },
];

export default function ViewDocument() {
    const { document } = usePage<{ document: Document }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-xl font-bold">{document.title}</h1>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 overflow-hidden rounded-md border md:min-h-min">
                    <div className="grid grid-cols-2">
                        <div className="border-accent border-r">
                            <PDFViewer file={document.document_url} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
