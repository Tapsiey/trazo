'use client';

import { useState, useCallback } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { Button } from '@/components/ui/button'; // shadcn/ui
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface PDFViewerProps {
    file: string; // e.g. document.document_url
    maxWidth?: number;
}

export default function PDFViewer({ file, maxWidth = 800 }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(maxWidth);

    const onResize = useCallback<ResizeObserverCallback>((entries) => {
        const [entry] = entries;
        if (entry) {
            setContainerWidth(entry.contentRect.width);
        }
    }, []);

    useResizeObserver(containerRef, {}, onResize);

    const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
        setNumPages(numPages);
        setPageNumber(1); // reset to first page
    };

    return (
        <div className="space-y-4">
            <div ref={setContainerRef} className="mx-auto w-full max-w-4xl">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<p className="text-center text-gray-500">Loading document...</p>}
                    error={<p className="text-center text-red-500">Failed to load PDF.</p>}
                >
                    <Page
                        pageNumber={pageNumber}
                        width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>
            </div>

            <div className="mx-auto flex max-w-2xl items-center justify-between">
                <Button onClick={() => setPageNumber((p) => Math.max(p - 1, 1))} disabled={pageNumber <= 1}>
                    Previous
                </Button>

                <span className="text-sm text-gray-600">
                    Page {pageNumber} of {numPages}
                </span>

                <Button onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))} disabled={pageNumber >= numPages}>
                    Next
                </Button>
            </div>
        </div>
    );
}
