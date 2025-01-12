import { motion, MotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
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

export const HeroParallax = ({
    products,
}: {
    products: {
        link: string;
        thumbnail: string;
        title: string;
    }[];
}) => {
    const firstRow = products.slice(0, 4);
    const secondRow = products.slice(4);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        offset: ['start start', 'end start'],
        target: ref,
    });

    const springConfig = { bounce: 100, damping: 30, stiffness: 300 };

    const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 500]), springConfig);
    const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig);
    const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
    const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
    const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
    const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 0]), springConfig);
    return (
        <div
            className="h-[200vh] py-20 overflow-visible antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
            ref={ref}
        >
            <Header />
            <motion.div
                className=""
                style={{
                    opacity,
                    rotateX,
                    rotateZ,
                    translateY,
                }}
            >
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-3 mb-10">
                    {firstRow.map((product) => (
                        <ProductCard key={product.title} product={product} translate={translateX} />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row mb-10 space-x-3 ">
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
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
            <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
                The Next Generation <br /> Islāmic Research Platform
            </h1>
            <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
                Building students of knowledge by giving the keys to research in the hands of the Muslims.
            </p>
            <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 mt-8">
                <FlipWords words={words} /> Knowledge
            </div>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        link: string;
        thumbnail: string;
        title: string;
    };
    translate: MotionValue<number>;
}) => {
    return (
        <motion.div
            className="group/product h-96 w-[30rem] relative flex-shrink-0"
            key={product.title}
            style={{
                x: translate,
            }}
            whileHover={{
                y: -20,
            }}
        >
            <Link className="block group-hover/product:shadow-2xl " href={product.link}>
                <Image
                    alt={product.title}
                    className="object-cover object-left-top absolute h-full w-full inset-0"
                    height="600"
                    src={product.thumbnail}
                    width="600"
                />
            </Link>
            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
            <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
                {product.title}
            </h2>
        </motion.div>
    );
};
