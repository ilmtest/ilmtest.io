import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: [
            '@radix-ui/react-collapsible',
            '@radix-ui/react-dialog',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
            '@tabler/icons-react',
            'class-variance-authority',
            'clsx',
            'lucide-react',
            'framer-motion',
            'tailwind-merge',
        ],
        viewTransition: true,
    },
    images: {
        remotePatterns: [{ hostname: 'pbs.twimg.com', pathname: '/media/**', port: '', protocol: 'https', search: '' }],
        unoptimized: true, // Disable server-based image optimization. Next.js does not support dynamic features with static exports
    },
    output: process.env.NODE_ENV === 'development' ? undefined : 'export', // enables static exports which is needed for GitHub Pages, but disabled in dev for dynamic rendering
    reactStrictMode: true,
    trailingSlash: true,
    typedRoutes: true,
};

export default nextConfig;
