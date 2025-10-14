'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const HoverEffect = ({
    className,
    items,
}: {
    className?: string;
    items: { description: string; title: string }[];
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);

    return (
        <div className={cn('grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3', className)}>
            {items.map((item, idx) => (
                <button
                    type="button"
                    className="group relative block h-full w-full p-2"
                    key={item?.title}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                                className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200 dark:bg-slate-800/[0.8]"
                                exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.15 } }}
                                initial={{ opacity: 0 }}
                                layoutId="hoverBackground"
                            />
                        )}
                    </AnimatePresence>
                    <Card>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                    </Card>
                </button>
            ))}
        </div>
    );
};

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div
            className={cn(
                'relative z-20 h-full w-full overflow-hidden rounded-2xl border border-transparent bg-black p-4 group-hover:border-slate-700 dark:border-white/[0.2]',
                className,
            )}
        >
            <div className="relative z-50">
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};
export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <h4 className={cn('mt-4 font-bold text-zinc-100 tracking-wide', className)}>{children}</h4>;
};
export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <p className={cn('mt-8 text-sm text-zinc-400 leading-relaxed tracking-wide', className)}>{children}</p>;
};
