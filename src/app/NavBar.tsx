'use client';
import { HoveredLink, Menu, MenuItem, ProductItem } from '@/components/NavBar';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export default function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<null | string>(null);
    return (
        <div className={cn('fixed top-10 inset-x-0 max-w-2xl mx-auto z-50', className)}>
            <Menu setActive={setActive}>
                <HoveredLink href="/">Home</HoveredLink>
                <MenuItem active={active} item="About" setActive={setActive}>
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/about">Who Are We?</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem active={active} item="The Project" setActive={setActive}>
                    <div className="  text-sm grid grid-cols-2 gap-10 p-4">
                        <ProductItem
                            description="Problem statement"
                            href="/history"
                            src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                            title="History"
                        />
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}
