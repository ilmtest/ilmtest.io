import type { Metadata } from 'next';

import { HoverEffect } from '@/components/HoverEffect';
import { HoverImageLink } from '@/components/HoverImageLink';
import { FloatingPhone } from '@/components/Phone';
import { SimpleSpotlight } from '@/components/SimpleSpotlight';

const beliefs = [
    {
        description:
            'We follow the Book of Allah and the Sunnah of the Messenger ﷺ according to the understanding of his Companions and those who followed them in goodness using correct proofs and evidences.',
        title: 'Our ʿAqīdah and Manhaj',
    },
    {
        description:
            'We invite the Muslims to unite upon the truth, the same one that was revealed to the Messenger ﷺ and followed by His Companions. We disassociate ourselves from innovation in the religion and distance ourselves from unity upon falsehood.',
        title: 'Unity',
    },
    {
        description:
            'We believe every Muslim - from the layman to the scholar - is capable of ijtihād, but each one to a different capacity. Each Muslim should strive to attain the unfiltered truth that was revealed to the first generation sincerely for the sake of Allah.',
        title: 'Ijtihād',
    },
    {
        description:
            "We worship Allah alone and we do not associate any partners with Him. We believe and affirm His Lordship, and Beautiful Names and Attributes as they have come to us without delving into the 'how'. We disassociate ourselves from therlogical rhetoric and its methodology.",
        title: 'Tawḥīd',
    },
    {
        description:
            'We believe every Muslim should do their utmost best to learn the evidences from the sources of revelation. The truth is not known by way of men, but men are known by their adherence to the truth.',
        title: 'Taqlīd',
    },
    {
        description:
            'We believe knowledge should be free in an absolute sense. Free from monetization, but also free from the shackles of copyright which restricts its distribution to the masses. Thus we believe all of our content can be shared freely without attributing it back to us.',
        title: 'Freedom',
    },
];

const pageTitle = 'About IlmTest';
const pageDescription = 'Learn about IlmTest’s mission, creed, and the applications we build to support the global Muslim community.';

export const metadata: Metadata = {
    description: pageDescription,
    openGraph: {
        description: pageDescription,
        images: [{ alt: 'About IlmTest spotlight', height: 630, url: '/logo.svg', width: 1200 }],
        title: pageTitle,
        url: 'https://ilmtest.io/about',
    },
    title: pageTitle,
};

export default function About() {
    return (
        <>
            <div className="relative flex h-[20rem] w-full overflow-hidden rounded-md bg-black/[0.96] bg-grid-white/[0.02] pt-50 antialiased md:items-center md:justify-center">
                <SimpleSpotlight />
                <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
                    <h1 className="bg-gradient-to-b bg-opacity-50 from-neutral-50 to-neutral-400 bg-clip-text text-center font-bold text-4xl text-transparent md:text-7xl">
                        Who
                        <br /> Are We?
                    </h1>
                </div>
            </div>
            <div className="mx-auto max-w-5xl px-8">
                <HoverEffect items={beliefs} />
            </div>
            <section className="grid place-content-center bg-neutral-900 p-12">
                <FloatingPhone
                    color="green"
                    hoverLabel="For BlackBerry 10"
                    href="https://forums.crackberry.com/blackberry-10-apps-f274/quran10-native-cascades-quran-app-muslims-bb10-801699/"
                    label="Quran10"
                    screenshot="/quran10.png"
                />
            </section>
            <section className="bg-neutral-950 p-4 md:p-8">
                <div className="group relative flex min-h-[2.5rem] justify-center overflow-hidden">
                    <span className="invisible">Hover over me</span>
                    <span className="-translate-x-1/2 group-hover:-translate-y-full absolute top-0 left-1/2 bg-gradient-to-b bg-opacity-50 from-neutral-50 to-neutral-400 bg-clip-text text-center font-bold text-2xl text-transparent transition-transform duration-500 ease-in-out hover:duration-300 md:text-3xl">
                        Our Apps
                    </span>
                    <span className="-translate-x-1/2 absolute top-0 left-1/2 w-full translate-y-full bg-gradient-to-b bg-opacity-50 from-neutral-50 to-neutral-400 bg-clip-text text-center font-bold text-2xl text-transparent transition-transform duration-500 ease-in-out hover:duration-300 group-hover:translate-y-0 md:text-3xl">
                        Our team iterated in the development on these apps with students of knowledge.
                    </span>
                </div>
                <div className="mx-auto max-w-5xl">
                    <HoverImageLink
                        heading="Quran10"
                        href="https://youtu.be/YOXtjnNWVZM"
                        imgSrc="/quran10.png"
                        subheading="Quran app for BlackBerry 10 with integrated tafāsir for each verse, recitations, similar verses, and multiple translations."
                    />
                    <HoverImageLink
                        heading="Salat10"
                        href="https://youtu.be/Y4QjODg6SR4"
                        imgSrc="/salat10.png"
                        subheading="Prayer times calculator"
                    />
                    <HoverImageLink
                        heading="Sunnah10"
                        href="https://youtu.be/S1S_adzlGpM"
                        imgSrc="/sunnah10.png"
                        subheading="Books of hadith, similar narration grouping, hadith explanations from the scholars."
                    />
                </div>
            </section>
        </>
    );
}
