import { IconArrowDown } from '@tabler/icons-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    type ComponentPropsWithoutRef,
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
} from 'react';

// Context to share setActive across menu components
const MenuContext = createContext<Dispatch<SetStateAction<string | null>> | null>(null);

const transition = {
    damping: 11.5,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.001,
    stiffness: 100,
    type: 'spring',
} as const;

type ActiveSetter = Dispatch<SetStateAction<string | null>>;

type MenuItemProps = { active: string | null; children?: ReactNode; item: string; setActive: ActiveSetter };

export const MenuItem = ({ active, children, item, setActive }: MenuItemProps) => {
    return (
        <button
            type="button"
            aria-expanded={active === item}
            aria-haspopup={children ? 'menu' : undefined}
            className="relative"
            role="menuitem"
            onFocus={() => setActive(item)}
            onMouseEnter={() => setActive(item)}
        >
            <motion.div
                className="group relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-md px-6 font-medium text-black text-neutral-200 duration-500 dark:text-white"
                transition={{ duration: 0.3 }}
            >
                <div className="group-hover:-translate-y-[150%] translate-y-0 opacity-100 transition group-hover:opacity-0">
                    {item}
                </div>
                <IconArrowDown className="absolute translate-y-[150%] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />
            </motion.div>
            {active !== null && (
                <motion.div
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    transition={transition}
                >
                    {active === item && (
                        <div className="-translate-x-1/2 absolute top-[calc(100%_+_1.2rem)] left-1/2 transform pt-4">
                            <motion.div
                                className="overflow-hidden rounded-2xl border border-black/[0.2] bg-white shadow-xl backdrop-blur-sm dark:border-white/[0.2] dark:bg-black"
                                layoutId="active" // layoutId ensures smooth animation
                                transition={transition}
                            >
                                <motion.div
                                    className="h-full w-max p-4"
                                    layout // layout ensures smooth animation
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </button>
    );
};

type MenuProps = { children: ReactNode; setActive: ActiveSetter };

export const Menu = ({ children, setActive }: MenuProps) => {
    return (
        <MenuContext.Provider value={setActive}>
            <nav
                aria-label="Primary navigation"
                className="relative flex justify-center space-x-4 rounded-full border border-transparent px-8 py-6 dark:border-white/[0.2]"
                onMouseLeave={() => setActive(null)} // resets the state
                onBlur={() => setActive(null)}
            >
                {children}
            </nav>
        </MenuContext.Provider>
    );
};

type ProductItemProps = { description: string; href: Route; src: string; title: string };

export const ProductItem = ({ description, href, src, title }: ProductItemProps) => {
    return (
        <Link className="flex space-x-2" href={href} prefetch={false} role="menuitem">
            <Image alt={title} className="flex-shrink-0 rounded-md shadow-2xl" height={70} src={src} width={140} />
            <div>
                <h4 className="mb-1 font-bold text-black text-xl dark:text-white">{title}</h4>
                <p className="max-w-[10rem] text-neutral-700 text-sm dark:text-neutral-300">{description}</p>
            </div>
        </Link>
    );
};

type HoveredLinkProps = ComponentPropsWithoutRef<typeof Link> & { children: ReactNode };

export const HoveredLink = ({ children, className, ...rest }: HoveredLinkProps) => {
    const setActive = useContext(MenuContext);

    return (
        <Link
            {...rest}
            className={clsx(
                'group relative inline-flex items-center justify-center overflow-hidden text-neutral-700 hover:text-white dark:text-neutral-200',
                className,
            )}
            onMouseEnter={() => setActive?.(null)}
            onFocus={() => setActive?.(null)}
        >
            <span>{children}</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20"></div>
            </div>
        </Link>
    );
};
