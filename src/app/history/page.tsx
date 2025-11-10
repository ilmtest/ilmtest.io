import type { Metadata } from 'next';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { Timeline } from '@/components/Timeline';

type TimelineEntry = { content: ReactNode; title: string };

const timelineData: TimelineEntry[] = [
    {
        content: (
            <div>
                <p className="mb-8 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
                    Salat10 was launched in{' '}
                    <a href="https://code.google.com/archive/p/salat10/" target="_blank" rel="noopener">
                        December 2012
                    </a>{' '}
                    as the first native prayer time calculation app for BlackBerry 10. After the release of the app we
                    realized there were a lot of misconceptions amongst the Muslims who used the app regarding some of
                    the fiqh of prayer and the issues related to it.
                    <br />
                    <br />
                    As a result in subsequent updates to the app we bundled in fiqh articles from the scholars of the
                    Sunnah as well as articles for basics for the new Muslims on how to pray.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <Image
                        alt="startup template"
                        className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                        height={500}
                        src="/history/salat10.webp"
                        width={500}
                    />
                </div>
            </div>
        ),
        title: '2012',
    },
    {
        content: (
            <div>
                <p className="mb-4 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">Beta Release</p>
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
                        ✅ User Authentication and Permissions
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
                        ✅ Hotlinking to Translations
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
                        ✅ Social Media Integration
                    </div>
                </div>
            </div>
        ),
        title: '2026',
    },
];

const pageTitle = 'IlmTest Project History';
const pageDescription =
    'Trace the milestones that shaped IlmTest—from the first Salat10 release to today’s ambitious research platform.';

export const metadata: Metadata = {
    description: pageDescription,
    openGraph: {
        description: pageDescription,
        images: [{ alt: 'IlmTest timeline', height: 630, url: '/logo.svg', width: 1200 }],
        title: pageTitle,
        url: 'https://ilmtest.io/history',
    },
    title: pageTitle,
};

export default function History() {
    return (
        <div className="w-full">
            <Timeline data={timelineData}>
                <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
                    <h2 className="mb-4 max-w-4xl text-black text-lg md:text-4xl dark:text-white">Project History</h2>
                    <p className="max-w-7xl text-neutral-700 text-sm md:text-base dark:text-neutral-300">
                        This app began when a brother in a WhatsApp group some benefits from al-Dhahabi’s Siyar regarding
                        some of the physical descriptions of the Companions. The benefit was copied and pasted from
                        somewhere online but it did not have the Arabic. Someone in the group asked: “And who is the
                        translator?” Meaning how do we know it is accurate, as there were several excerpts from different
                        parts of Siyar. The brother who posted it did not have any answer. As a result I went and went
                        through shamela.ws for hours, trying to match each one. This gave birth to the concept behind
                        ilmtest.
                        <br />
                        <br />
                        The underlying technology and architecture behind our platform is the ultimate evolution of a
                        series of services and apps that eventually developed into the ambitious project it has become.
                    </p>
                </div>
            </Timeline>
        </div>
    );
}
