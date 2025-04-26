import { Notification } from '@/components/notification';
import PDFViewer from '@/components/pdf-viewer';
import AppLayout from '@/layouts/app-layout';
import { formatTimestamp } from '@/lib/utils';
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
    //@ts-expect-error
    const { comments } = document;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h1 className="mb-4 text-xl text-foreground font-bold">{document.title}</h1>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 overflow-hidden rounded-md border md:min-h-min">
                    <div className="grid grid-cols-2">
                        <div className="border-accent border-r">
                            {/* @ts-ignore */}
                            <PDFViewer file={document.document_url} />
                        </div>
                        <div className="p-6">
                            <div className='border-b mb-1.5'>
                                <h3 className='font-semibold text-foreground mb-2'>Recent Actions</h3>
                            </div>
                            <div className="mt-4">
                                {comments.length > 0 && comments.map((comment: Comment) => {
                                    return <Notification
                                        sender={comment.user.name}
                                        timestamp={formatTimestamp(comment.updated_at)}
                                        message={comment.message}
                                        iconColor="purple"
                                        actionUrl="#"
                                    />
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
