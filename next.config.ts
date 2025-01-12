import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'aceternity.com',
                pathname: '/images/**',
                port: '',
                protocol: 'https',
                search: '',
            },
            {
                hostname: 'assets.aceternity.com',
                pathname: '/**',
                port: '',
                protocol: 'https',
                search: '',
            },
            {
                hostname: 'images.unsplash.com',
                pathname: '/**',
                port: '',
                protocol: 'https',
            },
            {
                hostname: 'api.microlink.io',
                pathname: '/**',
                port: '',
                protocol: 'https',
            },
        ],
    },
};

export default nextConfig;
