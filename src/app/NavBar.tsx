'use client';
import { useState } from 'react';
import { HoveredLink, Menu, MenuItem, ProductItem } from '@/components/NavBar';
import { cn } from '@/lib/utils';

export default function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<null | string>(null);
    return (
        <div className={cn('fixed inset-x-0 top-10 z-50 mx-auto max-w-2xl', className)}>
            <Menu setActive={setActive}>
                <HoveredLink href="/">Home</HoveredLink>
                <MenuItem active={active} item="About" setActive={setActive}>
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/about">Who Are We?</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem active={active} item="The Project" setActive={setActive}>
                    <div className="grid grid-cols-2 gap-10 p-4 text-sm">
                        <ProductItem
                            description="Problem statement"
                            href="/history"
                            src="https://pbs.twimg.com/media/EaB7g8CXQAAp-kM?format=jpg"
                            title="History"
                        />
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}
