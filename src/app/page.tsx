'use client';

import { FeaturesSectionDemo } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { HeroParallax } from '@/components/HeroParallax';
import { StatsRow } from '@/components/StatsRow';
import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from '@/components/TextRevealCard';
import { socials } from '@/data/socials';

import Navbar from './NavBar';

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroParallax products={socials} />
            <StatsRow />
            <div className="my-12 flex w-full flex-col items-center justify-center">
                <h1 className="mb-2 max-w-3xl text-center text-2xl font-semibold tracking-tighter text-gray-900 md:text-3xl dark:text-gray-100">
                    Features
                </h1>
                <p className="max-w-sm text-center text-sm text-gray-600 dark:text-gray-400">
                    IlmTest is packed with many features tailored towards the student of knowledge, translator,
                    publisher, researcher and the every day Muslim.
                </p>
                <FeaturesSectionDemo />
            </div>
            <div className="flex items-center justify-center bg-[#0E0E10] h-[30rem] rounded-2xl w-full">
                <TextRevealCard
                    revealText="“Be like a person whose feet are on the ground, his ambitions in the heavens.”"
                    text="فكن رجلا رجله فِي الثرى وهامة همته فِي الثريا"
                >
                    <TextRevealCardTitle>Our Mission.</TextRevealCardTitle>
                    <TextRevealCardDescription>
                        Is to translate each and every Islāmic text from Arabic to English and have it easily accessible
                        for the every day Muslim.
                    </TextRevealCardDescription>
                </TextRevealCard>
            </div>
            <Footer />
        </>
    );
}
