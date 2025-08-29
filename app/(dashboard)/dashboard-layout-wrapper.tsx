'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Home, Menu, Gauge, Settings, Pizza, MessageSquare, ShoppingBag, TicketCheck, Hammer, Wine } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardNavItems } from '@/components/dashboard/dashboard-nav-items';
import { Button } from '@heroui/react';
import { DashboardUserDropdown } from '@/components/dashboard/dashboard-user-dropdown';
import { Logo } from '@/components/icons';
import { TbTruckDelivery } from 'react-icons/tb';
import Notifications from '@/components/dashboard/notifications/notifications';

interface DashboardLayoutProps {
    children: React.ReactNode;
    session: any;
    restaurant: any;
}

export default function DashboardLayoutWrapper({ children, session, restaurant }: DashboardLayoutProps) {
    const [sheetOpen, setSheetOpen] = useState(false);

    const navItems = [
        {
            href: '/',
            icon: <Home className="h-5 w-5" />,
            label: 'Accueil',
        },
        {
            href: '/analytics',
            icon: <Gauge className="h-5 w-5" />,
            label: 'Tableau de bord',
        },
        {
            href: '/collections',
            icon: <Pizza className="h-5 w-5" />,
            label: 'Collections',
        },
        {
            href: '/boissons',
            icon: <Wine className="h-5 w-5" />,
            label: 'Boissons',
        },
        {
            href: '/delivery',
            icon: <TicketCheck className="h-5 w-5" />,
            label: 'Mes Courses',
        },
        {
            href: '/file-attente',
            icon: <TbTruckDelivery className="h-5 w-5" />,
            label: "File d'attente",
        },
        {
            href: '/tickets',
            icon: <Hammer className="h-5 w-5" />,
            label: "Gestion des tickets",
        },
        {
            href: '/notification',
            icon: <Bell className="h-5 w-5" />,
            label: 'Notification',
        },
        {
            href: '/orders',
            icon: <ShoppingBag className="h-5 w-5" />,
            label: 'Mes Commandes',
        },
        {
            href: '/messages',
            icon: <MessageSquare className="h-5 w-5" />,
            label: 'Messages',
        },
        {
            href: '/gestion-restaurant',
            icon: <Hammer className="h-5 w-5" />,
            label: 'Gestion de restaurant',
        },
        {
            href: '/settings',
            icon: <Settings className="h-5 w-5" />,
            label: 'Paramètres',
        },
    ];

    const handleNavItemClick = () => {
        setSheetOpen(false);
    };

    return (
        <div className="grid relative mx-auto w-full max-w-screen-2xl h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r dark:border-muted bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b dark:border-muted px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Logo />
                            <span className="">Turbo Delivery</span>
                        </Link>
                        <Notifications />
                    </div>
                    <div className="flex-1">
                        <DashboardNavItems navItems={navItems} />
                    </div>
                    <div className="mt-auto p-4">{/* <DashboardCardProgress /> */}</div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b dark:border-muted bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button 
                                variant="bordered" 
                                startContent={<Menu className="h-5 w-5" />} 
                                className="shrink-0 md:hidden" 
                                isIconOnly={true} 
                            />
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <DashboardNavItems navItems={navItems} onItemClick={handleNavItemClick} />
                        </SheetContent>
                    </Sheet>
                    <div className="md:hidden lg:hidden xl:hidden">
                        <Notifications />
                    </div>
                    <div className="w-full flex-1 flex items-center justify-end">
                        {/* <DashboardSearchBar /> */}
                        {/* <ThemeSwitch /> */}
                    </div>

                    {session && session?.user && <DashboardUserDropdown restaurant={restaurant} user={session?.user} />}
                </header>
                <main className="relative p-2 lg:p-4 w-full bg-muted overflow-y-auto h-full max-h-[calc(100vh-60px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}