import { type ClassValue, clsx } from 'clsx';
import { CheckCircle, Circle, CircleOff, HelpCircle, Timer } from 'lucide-react';
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
        value: 'backlog',
        label: 'Backlog',
        icon: HelpCircle,
    },
    {
        value: 'todo',
        label: 'Todo',
        icon: Circle,
    },
    {
        value: 'submitted',
        label: 'In Progress',
        icon: Timer,
    },
    {
        value: 'done',
        label: 'Done',
        icon: CheckCircle,
    },
    {
        value: 'canceled',
        label: 'Canceled',
        icon: CircleOff,
    },
];
