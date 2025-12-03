import { IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from 'next/font/google';
import type { ReactNode } from 'react';

import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { rootMetadata } from '@/lib/seo';

import Navbar from './NavBar';
import './globals.css';

const notoNaskhArabic = Noto_Naskh_Arabic({
    display: 'swap',
    subsets: ['arabic'],
    variable: '--font-noto-naskh-arabic',
    weight: ['400', '500', '600', '700'],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
    display: 'swap',
    subsets: ['arabic'],
    variable: '--font-ibm-plex-sans-arabic',
    weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const metadata = rootMetadata;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`antialiased ${notoNaskhArabic.variable} ${ibmPlexSansArabic.variable}`}>
                {/* Page-wide logo watermark */}
                <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-[0.03]">
                    <img src="/logo.svg" alt="" className="h-[80vh] w-auto" aria-hidden="true" />
                </div>

                <ThemeProvider>
                    <Navbar />
                    <main className="relative z-10 flex min-h-screen flex-col pt-20">{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
