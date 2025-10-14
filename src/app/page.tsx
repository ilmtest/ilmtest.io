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
                <h1 className="mb-2 max-w-3xl text-center font-semibold text-2xl text-gray-900 tracking-tighter md:text-3xl dark:text-gray-100">
                    Features
                </h1>
                <p className="max-w-sm text-center text-gray-600 text-sm dark:text-gray-400">
                    IlmTest is packed with many features tailored towards the student of knowledge, translator,
                    publisher, researcher and the every day Muslim.
                </p>
                <FeaturesSectionDemo />
            </div>
            <div className="flex h-[30rem] w-full items-center justify-center rounded-2xl bg-[#0E0E10]">
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
