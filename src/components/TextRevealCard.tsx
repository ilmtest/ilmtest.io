'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { cn } from '@/lib/utils';

export const TextRevealCard = ({
    children,
    className,
    revealText,
    text,
}: {
    children?: React.ReactNode;
    className?: string;
    revealText: string;
    text: string;
}) => {
    const [widthPercentage, setWidthPercentage] = useState(0);
    const cardRef = useRef<any | HTMLDivElement>(null);
    const [left, setLeft] = useState(0);
    const [localWidth, setLocalWidth] = useState(0);
    const [isMouseOver, setIsMouseOver] = useState(false);

    useEffect(() => {
        if (cardRef.current) {
            const { left, width: localWidth } = cardRef.current.getBoundingClientRect();
            setLeft(left);
            setLocalWidth(localWidth);
        }
    }, []);

    function mouseMoveHandler(event: any) {
        event.preventDefault();

        const { clientX } = event;
        if (cardRef.current) {
            const relativeX = clientX - left;
            setWidthPercentage((relativeX / localWidth) * 100);
        }
    }

    function mouseLeaveHandler() {
        setIsMouseOver(false);
        setWidthPercentage(0);
    }
    function mouseEnterHandler() {
        setIsMouseOver(true);
    }
    function touchMoveHandler(event: React.TouchEvent<HTMLButtonElement>) {
        event.preventDefault();
        const clientX = event.touches[0]!.clientX;
        if (cardRef.current) {
            const relativeX = clientX - left;
            setWidthPercentage((relativeX / localWidth) * 100);
        }
    }

    const rotateDeg = (widthPercentage - 50) * 0.1;
    return (
        <button
            type="button"
            className={cn(
                'relative w-[80rem] overflow-hidden rounded-lg border border-white/[0.08] bg-[#1d1c20] p-8',
                className,
            )}
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}
            onMouseMove={mouseMoveHandler}
            onTouchEnd={mouseLeaveHandler}
            onTouchMove={touchMoveHandler}
            onTouchStart={mouseEnterHandler}
            ref={cardRef}
        >
            {children}

            <div className="relative flex h-40 items-center overflow-hidden">
                <motion.div
                    animate={
                        isMouseOver
                            ? {
                                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                                  opacity: widthPercentage > 0 ? 1 : 0,
                              }
                            : { clipPath: `inset(0 ${100 - widthPercentage}% 0 0)` }
                    }
                    className="absolute z-20 bg-[#1d1c20] will-change-transform"
                    style={{ width: '100%' }}
                    transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
                >
                    <p
                        className="bg-gradient-to-b from-white to-neutral-300 bg-clip-text py-10 font-bold text-base text-transparent text-white sm:text-[3rem]"
                        style={{ textShadow: '4px 4px 15px rgba(0,0,0,0.5)' }}
                    >
                        {revealText}
                    </p>
                </motion.div>
                <motion.div
                    animate={{
                        left: `${widthPercentage}%`,
                        opacity: widthPercentage > 0 ? 1 : 0,
                        rotate: `${rotateDeg}deg`,
                    }}
                    className="absolute z-50 h-40 w-[8px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent will-change-transform"
                    transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
                ></motion.div>

                <div className="w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]">
                    <p
                        className="w-full bg-[#323238] bg-clip-text py-10 font-bold text-base text-transparent sm:text-[3rem]"
                        dir="rtl"
                    >
                        {text}
                    </p>
                    <MemoizedStars />
                </div>
            </div>
        </button>
    );
};

export const TextRevealCardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <h2 className={twMerge('mb-2 text-md text-white', className)}>{children}</h2>;
};

export const TextRevealCardDescription = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <p className={twMerge('text-[#a9a9a9] text-sm', className)}>{children}</p>;
};

const Stars = () => {
    const [sparkles, setSparkles] = useState<{ duration: number; left: number; opacity: number; top: number }[]>([]);

    useEffect(() => {
        const generateSparkles = () =>
            [...Array(80)].map(() => ({
                duration: Math.random() * 10 + 5,
                left: Math.random() * 100,
                opacity: Math.random(),
                top: Math.random() * 100,
            }));

        setSparkles(generateSparkles());
    }, []);

    return (
        <div className="absolute inset-0">
            {sparkles.map((sparkle, i) => (
                <motion.span
                    animate={{
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random(),
                        top: `${Math.random() * 100}%`,
                    }}
                    initial={{ left: `${sparkle.left}%`, opacity: sparkle.opacity, top: `${sparkle.top}%` }}
                    key={`star-${i.toString()}`}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        height: '2px',
                        position: 'absolute',
                        width: '2px',
                        zIndex: 1,
                    }}
                    transition={{ duration: sparkle.duration, ease: 'linear', repeat: Infinity }}
                ></motion.span>
            ))}
        </div>
    );
};

export const MemoizedStars = memo(Stars);
