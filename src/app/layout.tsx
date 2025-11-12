import type { ReactNode } from 'react';

import { Footer } from '@/components/Footer';
import { rootMetadata } from '@/lib/seo';

import Navbar from './NavBar';
import './globals.css';

export const metadata = rootMetadata;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
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
