'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

export const HoverEffect = ({
    className,
    items,
}: {
    className?: string;
    items: {
        description: string;
        title: string;
    }[];
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);

    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10', className)}>
            {items.map((item, idx) => (
                <div
                    className="relative group  block p-2 h-full w-full"
                    key={item?.title}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                                exit={{
                                    opacity: 0,
                                    transition: { delay: 0.2, duration: 0.15 },
                                }}
                                initial={{ opacity: 0 }}
                                layoutId="hoverBackground"
                            />
                        )}
                    </AnimatePresence>
                    <Card>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div
            className={cn(
                'rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20',
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
    return <h4 className={cn('text-zinc-100 font-bold tracking-wide mt-4', className)}>{children}</h4>;
};
export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <p className={cn('mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm', className)}>{children}</p>;
};
