'use client';

import { HeroParallax } from '@/components/HeroParallax';
import PreLoader from '@/components/Preloader';
import { StatsRow } from '@/components/StatsRow';
import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from '@/components/TextRevealCard';
import { socials } from '@/data/socials';

import { NavbarDemo } from './NavBar';

export default function Home() {
    return (
        <>
            <PreLoader />
            <NavbarDemo />
            <HeroParallax products={socials} />
            <StatsRow />
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
        </>
    );
}
