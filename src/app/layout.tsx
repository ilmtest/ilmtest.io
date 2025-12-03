import type { ReactNode } from 'react';

import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { rootMetadata } from '@/lib/seo';

import Navbar from './NavBar';
import './globals.css';

export const metadata = rootMetadata;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
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
