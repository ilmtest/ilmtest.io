import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{ hostname: 'pbs.twimg.com', pathname: '/media/**', port: '', protocol: 'https', search: '' }],
        unoptimized: true, // Disable server-based image optimization. Next.js does not support dynamic features with static exports
    },
    output: 'export', // enables static exports which is needed for GitHub Pages
    reactStrictMode: true,
    trailingSlash: true,
};

export default nextConfig;
