import { IconBrandGithub, IconBrandInstagram } from '@tabler/icons-react';
import React from 'react';

const TooltipIcons = () => {
    return (
        <div className="flex justify-around gap-4 items-center px-4 py-1 bg-black rounded-[15px] ring-1 ring-white">
            <a
                className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
                href="https://github.com/ilmtest"
                target="_blank"
            >
                <IconBrandGithub />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                    GitHub
                </div>
            </a>
            <a
                className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
                href="https://instagram.com/ilmtest"
                target="_blank"
            >
                <IconBrandInstagram />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 transform scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
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

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-100">
                    &copy; {new Date().getFullYear()} IlmTest. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
