import type { Config } from 'tailwindcss';

import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

const addVariablesForColors = ({ addBase, theme }: any) => {
    const allColors = flattenColorPalette(theme('colors'));
    const newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

    addBase({
        ':root': newVars,
    });
};

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    plugins: [addVariablesForColors],
    theme: {
        extend: {
            boxShadow: {
                input: '`0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`',
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
        },
    },
} satisfies Config;
