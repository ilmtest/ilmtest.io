import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    basePath: '/ilmtest.io',
    images: {
        remotePatterns: [
            {
                hostname: 'pbs.twimg.com',
                pathname: '/media/**',
                port: '',
                protocol: 'https',
                search: '',
            },
        ],
        unoptimized: true,
    },
};

export default nextConfig;
