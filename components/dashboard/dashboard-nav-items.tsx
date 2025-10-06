'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export const DashboardNavItems = ({
    navItems,
    onItemClick,
}: {
    navItems: {
        href?: string;
        label: string;
        icon: React.ReactNode;
        badge?: React.ReactNode;
        subItems?: { href: string; label: string }[];
    }[];
    onItemClick?: () => void;
}) => {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    const toggleMenu = (href: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [href]: !prev[href],
        }));
    };

    return (
        <nav className="grid md:items-start md:px-2 md:text-sm lg:px-4 gap-2 text-lg font-medium">
            {navItems.map((item, index) => {
                const isActive =
                    item.href &&
                    (pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href)));

                const isOpen = openMenus[item.href || `menu-${index}`] || false;

                // Bloc commun pour le contenu du parent (icône, label, badge)
                const parentContent = (
                    <div
                        className={`flex items-center gap-4 rounded-xl px-3 py-2 transition-colors ${
                            isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
                        } hover:text-foreground`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                {item.badge}
                            </Badge>
                        )}
                    </div>
                );

                return (
                    <div key={index}>
                        {/* Si item.href existe → Link, sinon → div clickable */}
                        {item.href ? (
                            <Link
                                href={item.href}
                                onClick={onItemClick}
                                className="mx-[-0.65rem] block"
                            >
                                {parentContent}
                            </Link>
                        ) : (
                            <div
                                onClick={() => item.subItems && toggleMenu(item.href || `menu-${index}`)}
                                className="mx-[-0.65rem] cursor-pointer"
                            >
                                {parentContent}
                            </div>
                        )}

                        {/* Sous-menu */}
                        {item.subItems && isOpen && (
                            <div className="flex flex-col pl-8 mt-1 gap-1">
                                {item.subItems.map((sub, subIndex) => {
                                    const subActive = pathname === sub.href;
                                    return (
                                        <Link
                                            key={subIndex}
                                            href={sub.href}
                                            onClick={onItemClick}
                                            className={`text-sm rounded-lg px-2 py-1 hover:bg-muted transition-all ${
                                                subActive
                                                    ? 'bg-muted text-primary'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            {sub.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};
