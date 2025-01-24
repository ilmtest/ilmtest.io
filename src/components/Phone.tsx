'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface FloatingPhoneProps {
    color: string;
    hoverLabel: string;
    href: string;
    label: string;
    screenshot: string;
}

export const FloatingPhone: React.FC<FloatingPhoneProps> = ({ color, hoverLabel, href, label, screenshot }) => {
    return (
        <div
            className="rounded-[24px] p-2"
            style={{
                backgroundColor: color, // Dynamic background color
                transform: 'rotateY(-30deg) rotateX(15deg)',
                transformStyle: 'preserve-3d',
            }}
        >
            <motion.div
                animate={{
                    transform: 'translateZ(32px) translateY(-8px)',
                }}
                className="relative h-96 w-56 rounded-[24px] border-2 border-b-4 border-r-4 border-white border-l-neutral-200 border-t-neutral-200 bg-neutral-900 p-1 pl-[3px] pt-[3px]"
                initial={{
                    transform: 'translateZ(8px) translateY(-2px)',
                }}
                transition={{
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror',
                }}
            >
                <HeaderBar color={color} />
                <Screen color={color} hoverLabel={hoverLabel} href={href} label={label} screenshot={screenshot} />
            </motion.div>
        </div>
    );
};

interface HeaderBarProps {
    color: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ color }) => {
    return (
        <>
            <div
                className="absolute left-[50%] top-2.5 z-10 h-2 w-16 -translate-x-[50%] rounded-md"
                style={{ backgroundColor: color }}
            ></div>
            <div className="absolute right-3 top-2 z-10 flex gap-2">{/** icons */}</div>
        </>
    );
};

interface ScreenProps {
    color: string;
    href: string;
    label: string;
    screenshot: string;
}

const Screen: React.FC<ScreenProps> = ({ color, hoverLabel, href, label, screenshot }) => {
    return (
        <div className="relative z-0 h-full w-full overflow-hidden rounded-[20px] bg-neutral-900">
            <Image
                alt="App Screenshot"
                className="rounded-[20px]"
                fill
                src={screenshot}
                style={{ objectFit: 'cover' }}
            />
            <a
                className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-center rounded-lg border-[1px] py-2 text-sm font-medium backdrop-blur focus:outline-none focus:ring-2 focus:ring-violet-500 group overflow-hidden duration-500"
                href={href}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: color,
                    color: color,
                }}
                target="_blank"
            >
                <div className="translate-x-0 transition group-hover:-translate-x-[300%]">{label}</div>
                <div className="absolute translate-x-[300%] transition group-hover:translate-x-0">{hoverLabel}</div>
            </a>
            <div
                className="absolute -bottom-0 left-[50%] h-18 w-96 -translate-x-[50%] opacity-65"
                style={{ backgroundColor: color }}
            />
        </div>
    );
};
