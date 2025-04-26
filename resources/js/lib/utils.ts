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


export function formatTimestamp(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);

    const day = date.getDate().toString().padStart(2, '0');

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = months[date.getMonth()];

    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedHours = hours.toString().padStart(2, '0');

    return `${day} ${month} ${year} ${formattedHours}:${minutes} ${ampm}`;
}
