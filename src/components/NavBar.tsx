import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const transition = {
    damping: 11.5,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.001,
    stiffness: 100,
    type: 'spring',
};

export const MenuItem = ({
    active,
    children,
    item,
    setActive,
}: {
    active: null | string;
    children?: React.ReactNode;
    item: string;
    setActive: (item: string) => void;
}) => {
    return (
        <div className="relative " onMouseEnter={() => setActive(item)}>
            <motion.p
                className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white inline-block px-4 py-2 rounded-md hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800"
                transition={{ duration: 0.3 }}
            >
                {item}
            </motion.p>
            {active !== null && (
                <motion.div
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    transition={transition}
                >
                    {active === item && (
                        <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
                            <motion.div
                                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
                                layoutId="active" // layoutId ensures smooth animation
                                transition={transition}
                            >
                                <motion.div
                                    className="w-max h-full p-4"
                                    layout // layout ensures smooth animation
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export const Menu = ({
    children,
    setActive,
}: {
    children: React.ReactNode;
    setActive: (item: null | string) => void;
}) => {
    return (
        <nav
            className="relative rounded-full border border-transparent dark:bg-black/80 dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-4 px-8 py-6 "
            onMouseLeave={() => setActive(null)} // resets the state
        >
            {children}
        </nav>
    );
};

export const ProductItem = ({
    description,
    href,
    src,
    title,
}: {
    description: string;
    href: string;
    src: string;
    title: string;
}) => {
    return (
        <Link className="flex space-x-2" href={href}>
            <Image alt={title} className="flex-shrink-0 rounded-md shadow-2xl" height={70} src={src} width={140} />
            <div>
                <h4 className="text-xl font-bold mb-1 text-black dark:text-white">{title}</h4>
                <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">{description}</p>
            </div>
        </Link>
    );
};

export const HoveredLink = ({ children, ...rest }: any) => {
    return (
        <Link {...rest} className="text-neutral-700 dark:text-neutral-200 hover:text-white ">
            {children}
        </Link>
    );
};
