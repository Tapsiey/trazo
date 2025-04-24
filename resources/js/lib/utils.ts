import { type ClassValue, clsx } from 'clsx';
import { Archive, CheckCircle, CircleOff, FolderKanban, NotebookText, SendHorizonal } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatShortDate(dateStr: string): string {
    const date = new Date(dateStr);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
}

export function capitalize(word: string) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const statuses = [
    {
        value: 'categorised',
        label: 'Categorised',
        icon: NotebookText,
    },
    {
        value: 'in-review',
        label: 'In Review',
        icon: FolderKanban,
    },
    {
        value: 'submitted',
        label: 'Submitted',
        icon: SendHorizonal,
    },
    {
        value: 'done',
        label: 'Complete',
        icon: CheckCircle,
    },
    {
        value: 'cancelled',
        label: 'Canceled',
        icon: CircleOff,
    },
    {
        value: 'archived',
        label: 'Archived',
        icon: Archive,
    },
];
