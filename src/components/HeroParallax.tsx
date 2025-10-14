'use client';

import { type MotionValue, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { FlipWords } from './FlipWords';

const words = [
    'Translating',
    'Inspiring',
    'Researching',
    'Spreading',
    'Purifying',
    'Revising',
    'Connecting',
    'Correcting',
    'Publishing',
    'Simplifying',
];

export const HeroParallax = ({ products }: { products: { link: string; thumbnail: string; title: string }[] }) => {
    const firstRow = products.slice(0, 4);
    const secondRow = products.slice(4);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({ offset: ['start start', 'end start'], target: ref });

    const springConfig = { bounce: 100, damping: 30, stiffness: 300 };

    const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 500]), springConfig);
    const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig);
    const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
    const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
    const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
    const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 0]), springConfig);
    return (
        <div
            className="relative flex h-[200vh] flex-col self-auto overflow-visible py-20 antialiased [perspective:1000px] [transform-style:preserve-3d]"
            ref={ref}
        >
            <Header />
            <motion.div className="" style={{ opacity, rotateX, rotateZ, translateY }}>
                <motion.div className="mb-10 flex flex-row-reverse space-x-3 space-x-reverse">
                    {firstRow.map((product) => (
                        <ProductCard key={product.title} product={product} translate={translateX} />
                    ))}
                </motion.div>
                <motion.div className="mb-10 flex flex-row space-x-3">
                    {secondRow.map((product) => (
                        <ProductCard key={product.title} product={product} translate={translateXReverse} />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const Header = () => {
    return (
        <div className="relative top-0 left-0 mx-auto w-full max-w-7xl px-4 py-20 md:py-40">
            <h1 className="font-bold text-2xl md:text-7xl dark:text-white">
                The Next Generation <br /> Islāmic Research Platform
            </h1>
            <p className="mt-8 max-w-2xl text-base md:text-xl dark:text-neutral-200">
                Building students of knowledge by giving the keys to research in the hands of the Muslims.
            </p>
            <div className="mx-auto mt-8 font-normal text-4xl text-neutral-600 dark:text-neutral-400">
                <FlipWords words={words} /> Knowledge
            </div>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: { link: string; thumbnail: string; title: string };
    translate: MotionValue<number>;
}) => {
    return (
        <motion.div
            className="group/product relative h-96 w-[30rem] flex-shrink-0"
            key={product.title}
            style={{ x: translate }}
            whileHover={{ y: -20 }}
        >
            <Image
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover object-left-top"
                height="600"
                src={product.thumbnail}
                width="600"
            />
            <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-80"></div>
            <h2 className="absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">
                <Link className="block group-hover/product:shadow-2xl" href={product.link} target="_blank">
                    {product.title}
                </Link>
            </h2>
        </motion.div>
    );
};
