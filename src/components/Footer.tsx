import { IconBrandGithub, IconBrandInstagram } from '@tabler/icons-react';
import type React from 'react';

const TooltipIcons = () => {
    return (
        <div className="flex items-center justify-around gap-4 rounded-[15px] bg-black px-4 py-1 ring-1 ring-white">
            <a
                className="group relative rounded-full p-2 transition-all duration-500 hover:cursor-pointer hover:bg-slate-800"
                href="https://github.com/ilmtest"
                target="_blank"
                rel="noopener"
            >
                <IconBrandGithub />
                <div className="-translate-x-1/2 absolute bottom-full left-1/2 mb-4 w-max scale-50 transform rounded-md bg-black px-2 py-1 text-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                    GitHub
                </div>
            </a>
            <a
                className="group relative rounded-full p-2 transition-all duration-500 hover:cursor-pointer hover:bg-slate-800"
                href="https://instagram.com/ilmtest"
                target="_blank"
                rel="noopener"
            >
                <IconBrandInstagram />
                <div className="-translate-x-1/2 absolute bottom-full left-1/2 mb-4 w-max scale-50 transform rounded-md bg-black px-2 py-1 text-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
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
                <div className="mt-5 flex justify-center space-x-6">
                    <TooltipIcons />
                </div>

                <p className="mt-6 text-center text-gray-600 text-sm dark:text-gray-100">
                    &copy; {new Date().getFullYear()} IlmTest. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
