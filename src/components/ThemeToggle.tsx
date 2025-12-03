'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                type="button"
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
            >
                <div className="h-5 w-5" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="group rounded-lg p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-blue/10 hover:to-brand-orange/10 dark:hover:from-brand-blue/20 dark:hover:to-brand-orange/20"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-brand-yellow transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
            ) : (
                <Moon className="h-5 w-5 text-brand-blue transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            )}
        </button>
    );
}
