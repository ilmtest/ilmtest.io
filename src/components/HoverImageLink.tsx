'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import type React from 'react';
import { useRef } from 'react';

interface LinkProps {
    heading: string;
    href: string;
    imgSrc: string;
    subheading: string;
}

export const HoverImageLink = ({ heading, href, imgSrc, subheading }: LinkProps) => {
    const ref = useRef<HTMLAnchorElement | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const top = useTransform(mouseYSpring, [0.5, -0.5], ['40%', '60%']);
    const left = useTransform(mouseXSpring, [0.5, -0.5], ['60%', '70%']);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const rect = ref.current!.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    return (
        <motion.a
            className="group relative flex items-center justify-between border-neutral-700 border-b-2 py-4 transition-colors duration-500 hover:border-neutral-50 md:py-8"
            href={href}
            initial="initial"
            onMouseMove={handleMouseMove}
            ref={ref}
            target="_blank"
            whileHover="whileHover"
        >
            <div>
                <motion.span
                    className="relative z-10 block font-bold text-4xl text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50 md:text-6xl"
                    transition={{ delayChildren: 0.25, staggerChildren: 0.075, type: 'spring' }}
                    variants={{ initial: { x: 0 }, whileHover: { x: -16 } }}
                >
                    {heading.split('').map((l, i) => (
                        <motion.span
                            className="inline-block"
                            key={i.toString()}
                            transition={{ type: 'spring' }}
                            variants={{ initial: { x: 0 }, whileHover: { x: 16 } }}
                        >
                            {l}
                        </motion.span>
                    ))}
                </motion.span>
                <span className="relative z-10 mt-2 block text-base text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50">
                    {subheading}
                </span>
            </div>

            <motion.div
                className="absolute z-0 h-24 w-32 overflow-hidden rounded-lg md:h-48 md:w-64"
                style={{ left, top, translateX: '-50%', translateY: '-50%' }}
                transition={{ type: 'spring' }}
                variants={{ initial: { rotate: '-12.5deg', scale: 0 }, whileHover: { rotate: '12.5deg', scale: 1 } }}
            >
                <Image alt={`Image representing a link for ${heading}`} className="object-cover" src={imgSrc} fill />
            </motion.div>

            <motion.div
                className="relative z-10 p-4"
                transition={{ type: 'spring' }}
                variants={{ initial: { opacity: 0, x: '25%' }, whileHover: { opacity: 1, x: '0%' } }}
            >
                <IconArrowRight className="text-5xl text-neutral-50" />
            </motion.div>
        </motion.a>
    );
};
