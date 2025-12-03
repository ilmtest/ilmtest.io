import { IconBrandGithub, IconBrandInstagram } from '@tabler/icons-react';
import type React from 'react';

import { ThemeToggle } from './ThemeToggle';

const TooltipIcons = () => {
    return (
        <div className="flex items-center justify-around gap-4 rounded-[15px] border border-gray-200 bg-white/90 px-4 py-1 shadow-lg backdrop-blur-sm dark:border-white dark:bg-black dark:ring-1 dark:ring-white">
            <a
                className="group relative rounded-full p-2 text-brand-blue transition-all duration-500 hover:cursor-pointer hover:bg-brand-blue/10 dark:text-white dark:hover:bg-slate-800"
                href="https://github.com/ilmtest"
                rel="noopener"
                target="_blank"
            >
                <IconBrandGithub />
                <div className="-translate-x-1/2 absolute bottom-full left-1/2 mb-4 w-max scale-50 transform rounded-md bg-gray-900 px-2 py-1 text-white opacity-0 shadow-lg transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 dark:bg-black">
                    GitHub
                </div>
            </a>
            <a
                className="group relative rounded-full p-2 text-brand-orange transition-all duration-500 hover:cursor-pointer hover:bg-brand-orange/10 dark:text-white dark:hover:bg-slate-800"
                href="https://instagram.com/ilmtest"
                rel="noopener"
                target="_blank"
            >
                <IconBrandInstagram />
                <div className="-translate-x-1/2 absolute bottom-full left-1/2 mb-4 w-max scale-50 transform rounded-md bg-gray-900 px-2 py-1 text-white opacity-0 shadow-lg transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 dark:bg-black">
                    Instagram
                </div>
            </a>
        </div>
    );
};

export const Footer: React.FC = () => {
    return (
        <footer className="w-full">
            <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mt-5 flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <TooltipIcons />
                    <ThemeToggle />
                </div>

                <p className="mt-6 text-center text-gray-600 text-sm dark:text-gray-100">
                    &copy; {new Date().getFullYear()} IlmTest. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
