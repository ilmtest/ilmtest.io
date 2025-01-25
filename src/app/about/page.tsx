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

export default function About() {
    return (
        <>
            <div className="h-[20rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
                <SimpleSpotlight />
                <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
                    <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Who
                        <br /> Are We?
                    </h1>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-8">
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
                <div className="mx-auto max-w-5xl">
                    <HoverImageLink
                        heading="Quran10"
                        href="https://youtu.be/YOXtjnNWVZM"
                        imgSrc="/quran10.png"
                        subheading="Native Quran app for BlackBerry 10 with integrated tafāsir for each verse, recitations, similar verses, and multiple translations."
                    />
                    <HoverImageLink
                        heading="Salat10"
                        href="https://youtu.be/Y4QjODg6SR4"
                        imgSrc="/salat10.png"
                        subheading="We work with great people"
                    />
                    <HoverImageLink
                        heading="Sunnah10"
                        href="https://youtu.be/S1S_adzlGpM"
                        imgSrc="/sunnah10.png"
                        subheading="Our work speaks for itself"
                    />
                </div>
            </section>
        </>
    );
}
