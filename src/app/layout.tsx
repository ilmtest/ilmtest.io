import type { Metadata } from 'next';

import { Footer } from '@/components/Footer';

import Navbar from './NavBar';
import './globals.css';

const siteName = 'IlmTest';
const description = 'Islām in its original form. Explore translations, history, and tools built for the student of knowledge.';
const ogImage = '/logo.svg';

export const metadata: Metadata = {
    applicationName: siteName,
    description,
    metadataBase: new URL('https://ilmtest.io'),
    openGraph: {
        description,
        images: [{ alt: `${siteName} logo`, height: 630, url: ogImage, width: 1200 }],
        siteName,
        title: siteName,
        type: 'website',
        url: 'https://ilmtest.io',
    },
    title: {
        default: siteName,
        template: `%s | ${siteName}`,
    },
    twitter: {
        card: 'summary_large_image',
        description,
        images: [ogImage],
        title: siteName,
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Navbar />
                <main className="flex min-h-screen flex-col" role="main">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
