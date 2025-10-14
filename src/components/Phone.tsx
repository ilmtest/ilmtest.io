'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type React from 'react';

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
                animate={{ transform: 'translateZ(32px) translateY(-8px)' }}
                className="relative h-96 w-56 rounded-[24px] border-2 border-white border-t-neutral-200 border-r-4 border-b-4 border-l-neutral-200 bg-neutral-900 p-1 pt-[3px] pl-[3px]"
                initial={{ transform: 'translateZ(8px) translateY(-2px)' }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
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
                className="-translate-x-[50%] absolute top-2.5 left-[50%] z-10 h-2 w-16 rounded-md"
                style={{ backgroundColor: color }}
            ></div>
            <div className="absolute top-2 right-3 z-10 flex gap-2">{/** icons */}</div>
        </>
    );
};

interface ScreenProps {
    color: string;
    hoverLabel: string;
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
                className="group absolute right-4 bottom-4 left-4 z-10 flex items-center justify-center overflow-hidden rounded-lg border-[1px] py-2 font-medium text-sm backdrop-blur duration-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                href={href}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: color, color: color }}
                target="_blank"
            >
                <div className="group-hover:-translate-x-[300%] translate-x-0 transition">{label}</div>
                <div className="absolute translate-x-[300%] transition group-hover:translate-x-0">{hoverLabel}</div>
            </a>

            <div
                className="-bottom-0 -translate-x-[50%] absolute left-[50%] h-18 w-96 opacity-65"
                style={{ backgroundColor: color }}
            />
        </div>
    );
};
