'use client';
import { HoveredLink, Menu, MenuItem, ProductItem } from '@/components/NavBar';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export function NavbarDemo() {
    return <Navbar className="top-2" />;
}

function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<null | string>(null);
    return (
        <div className={cn('fixed top-10 inset-x-0 max-w-2xl mx-auto z-50', className)}>
            <Menu setActive={setActive}>
                <MenuItem active={active} item="About" setActive={setActive}>
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/web-dev">Who Are We?</HoveredLink>
                        <HoveredLink href="/interface-design">Our Beliefs</HoveredLink>
                        <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
                        <HoveredLink href="/branding">Branding</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem active={active} item="The Project" setActive={setActive}>
                    <div className="  text-sm grid grid-cols-2 gap-10 p-4">
                        <ProductItem
                            description="Production ready Tailwind css components for your next project"
                            href="https://tailwindmasterkit.com"
                            src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                            title="History"
                        />
                        <ProductItem
                            description="Prepare for tech interviews like never before."
                            href="https://algochurn.com"
                            src="https://assets.aceternity.com/demos/algochurn.webp"
                            title="Mission"
                        />
                        <ProductItem
                            description="Prepare for tech interviews like never before."
                            href="https://algochurn.com"
                            src="https://assets.aceternity.com/demos/algochurn.webp"
                            title="Vision"
                        />
                        <ProductItem
                            description="Prepare for tech interviews like never before."
                            href="https://algochurn.com"
                            src="https://assets.aceternity.com/demos/algochurn.webp"
                            title="Proposal"
                        />
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}
