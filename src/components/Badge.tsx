import type React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
    const baseStyles =
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

    const variants = {
        default:
            'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900',
        destructive:
            'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 bg-red-500 text-white',
        outline: 'text-foreground border-slate-200 dark:border-slate-800',
        secondary:
            'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50',
    };

    return <div className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</div>;
}
