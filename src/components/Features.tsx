import {
    IconAdjustmentsBolt,
    IconBook,
    IconBubble,
    IconCurrencyDollar,
    IconDeviceAudioTape,
    IconEaseInOut,
    IconScale,
    IconSearch,
    IconSocial,
    IconTag,
    IconTerminal2,
    IconUsersGroup,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export function FeaturesSectionDemo() {
    const features = [
        {
            description:
                'We strive to build one unified platform that other Islāmic apps and services can integrate with to have a consistent and authentic source of information.',
            icon: <IconTerminal2 />,
            title: 'Built for developers',
        },
        {
            description: 'Just type as you would and let us take care of the formatting.',
            icon: <IconEaseInOut />,
            title: 'Automatic ALA-LC Transliterations',
        },
        {
            description:
                'Our services are completely free, but we are developing our own cryptocurrency token which contributors can earn for their work',
            icon: <IconCurrencyDollar />,
            title: 'Free to use but Get Paid for your Efforts',
        },
        {
            description: `Work together, peer-review each other's translations, critique it to perfect the accuracy and readability.`,
            icon: <IconUsersGroup />,
            title: 'Collaboration',
        },
        {
            description:
                'Convert audio lectures of the mashaykh into their transcriptions and browse them the same way you would a book',
            icon: <IconDeviceAudioTape />,
            title: 'Transcriptions',
        },
        {
            description:
                'Any dāʿī who has their own social media can post benefits directly to their social media and schedule posts.',
            icon: <IconSocial />,
            title: 'Social Media Integrations',
        },
        {
            description:
                'For existing digital libraries, we strive to make necessary corrections to fix any inaccuracies in them.',
            icon: <IconAdjustmentsBolt />,
            title: 'Corrections and Revisions',
        },
        {
            description:
                'Organize notes, benefits, translations, excerpts however you wish to easily research any topic you are looking for.',
            icon: <IconTag />,
            title: 'Tagging System',
        },
        {
            description:
                'Browse hundreds and thousands of explanations of the texts to understand the authentic interpretations of them as explained by the scholars.',
            icon: <IconBubble />,
            title: 'Explanations',
        },
        {
            description:
                'Understand technical Islāmic concepts and words, improve your Arabic vocabulary and understanding.',
            icon: <IconBook />,
            title: 'Glossary',
        },
        {
            description:
                'Differentiate between the weak narrations from the authentic ones based on the research of the scholars.',
            icon: <IconScale />,
            title: 'Authentication',
        },
        {
            description:
                'Go deep into research, learn the biographies of narrators and authors, uncover their travels and their lives.',
            icon: <IconSearch />,
            title: 'Depth',
        },
    ];
    return (
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    description,
    icon,
    index,
    title,
}: {
    description: string;
    icon: React.ReactNode;
    index: number;
    title: string;
}) => {
    return (
        <div
            className={cn(
                'group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800',
                (index === 0 || index === 4) && 'lg:border-l dark:border-neutral-800',
                index < 4 && 'lg:border-b dark:border-neutral-800',
            )}
        >
            {index < 4 && (
                <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
            )}
            {index >= 4 && (
                <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
            )}
            <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">{icon}</div>
            <div className="relative z-10 mb-2 px-10 font-bold text-lg">
                <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
                <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-neutral-600 text-sm dark:text-neutral-300">{description}</p>
        </div>
    );
};
