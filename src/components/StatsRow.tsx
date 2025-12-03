import { IconBulb, IconClock, IconPencil, IconUser } from '@tabler/icons-react';
import type React from 'react';
import { getDaysActive } from '@/data/socials';

interface StatProps {
    label: string;
    percentage?: string;
    percentageType?: 'negative' | 'positive';
    value: number | string;
}

const Stat: React.FC<StatProps> = ({ label, percentage, percentageType, value }) => (
    <div className="grow">
        <div className="flex items-center gap-x-2">
            <p className="text-gray-500 text-xs uppercase tracking-wide dark:text-neutral-500">{label}</p>
        </div>
        <div className="mt-1 flex items-center gap-x-2">
            <h3 className="font-medium text-gray-800 text-xl sm:text-2xl dark:text-neutral-200">{value}</h3>
            {percentage && (
                <span
                    className={`inline-flex items-center gap-x-1 rounded-full px-2 py-0.5 ${
                        percentageType === 'positive'
                            ? 'bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100'
                            : 'bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100'
                    }`}
                >
                    <svg
                        className="inline-block size-4 self-center"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <title>{percentageType === 'positive' ? 'Trend up' : 'Trend down'}</title>
                        <polyline
                            points={
                                percentageType === 'positive'
                                    ? '22 7 13.5 15.5 8.5 10.5 2 17'
                                    : '22 17 13.5 8.5 8.5 13.5 2 7'
                            }
                        />
                        <polyline points="16 7 22 7 22 13" />
                    </svg>
                    <span className="inline-block font-medium text-xs">{percentage}</span>
                </span>
            )}
        </div>
    </div>
);

interface CardProps {
    Icon: any;
    statProps: StatProps;
}

const Card: React.FC<CardProps> = ({ Icon, statProps }) => (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950">
        <div className="flex gap-x-4 p-4 md:p-5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-green">
                <Icon className="size-6 text-white" />
            </div>
            <Stat {...statProps} />
        </div>
    </div>
);

export const StatsRow: React.FC = () => {
    return (
        <div className="mx-auto max-w-[85rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                <Card
                    Icon={IconBulb}
                    statProps={{
                        label: 'Days Active',
                        percentage: '12.5%',
                        percentageType: 'positive',
                        value: getDaysActive().toString(),
                    }}
                />

                <Card Icon={IconUser} statProps={{ label: 'Followers', value: '5107+' }} />

                <Card
                    Icon={IconPencil}
                    statProps={{
                        label: 'Translations Recorded',
                        percentage: '47,656',
                        percentageType: 'negative',
                        value: '127,712',
                    }}
                />

                <Card Icon={IconClock} statProps={{ label: 'Development Hours', value: '1000+' }} />
            </div>
        </div>
    );
};
