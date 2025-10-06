'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { Image, Button } from '@heroui/react';
import { TbTruckDelivery } from 'react-icons/tb';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Notifications from '@/components/dashboard/notifications/notifications';
import { DashboardNavItems } from '@/components/dashboard/dashboard-nav-items';
import { DashboardUserDropdown } from '@/components/dashboard/dashboard-user-dropdown';
import { Bell, Gauge, Pizza, ShoppingBag, TicketCheck, Hammer, Menu } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    session: any;
    restaurant: any;
}

export default function DashboardLayoutWrapper({ children, session, restaurant }: DashboardLayoutProps) {
    const router = useRouter();
    const [sheetOpen, setSheetOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'turbo' | 'orders'>('turbo');

    const turboNav = [
        { href: '/delivery', icon: <TicketCheck className="h-5 w-5" />, label: 'Demande de TURBOY' },
        { href: '/tickets', icon: <Hammer className="h-5 w-5" />, label: 'Mes Tickets' },
        { href: '/file-attente', icon: <TbTruckDelivery className="h-5 w-5" />, label: 'Ma file d\'attente' },
        { href: '/notification', icon: <Bell className="h-5 w-5" />, label: 'Notification' },
        { href: '/analytics', icon: <Gauge className="h-5 w-5" />, label: 'Dashboard' },
    ];

    const ordersNav = [
        { href: '/orders', icon: <ShoppingBag className="h-5 w-5" />, label: 'Mes Commandes' },
        { 
            href: '', 
            icon: <Pizza className="h-5 w-5" />, 
            label: 'Collection',
            subItems: [
                { href: '/collections', label: 'Plats' },
                { href: '/boissons', label: 'Boissons' },
            ]
        },
        { href: '/analytics', icon: <Gauge className="h-5 w-5" />, label: 'Dashboard' },
    ];

    const navItems = activeSection === 'turbo' ? turboNav : ordersNav;

    return (
        <div className="grid relative mx-auto w-full max-w-screen-2xl h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <div className="hidden border-r dark:border-muted bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex flex-col h-20 items-center justify-center border-b dark:border-muted px-4 lg:h-[60px] lg:px-6 gap-2">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Logo className="rounded-md" />
                            <span className="">TURBO PARTENAIRE</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <DashboardNavItems navItems={navItems} />
                    </div>
                    <div className="mt-auto p-4">{/* Footer si besoin */}</div>
                </div>
            </div>

            {/* Contenu principal */}
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
                            <DashboardNavItems navItems={navItems} onItemClick={() => setSheetOpen(false)} />
                        </SheetContent>
                    </Sheet>

                    <div className="md:hidden lg:hidden xl:hidden">
                        <Notifications />
                    </div>

                    <div className="w-full flex-1 flex items-center justify-end">
                        {/* espace pour recherche ou theme switch */}
                    </div>

                    {session && session?.user && <DashboardUserDropdown restaurant={restaurant} user={session?.user} />}
                </header>

                <main className="relative p-2 lg:p-4 w-full bg-muted h-full max-h-[calc(100vh-60px)] overflow-y-auto">
                    {/* bloc sticky doit être directement dans main */}
                    <div className="sticky top-0 z-40 bg-muted/60 backdrop-blur-md pt-2 pb-2">
                        <div className="bg-white dark:bg-muted rounded-md shadow-lg p-6 w-full border border-gray-200 dark:border-muted">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <Button
                                variant={activeSection === 'turbo' ? 'solid' : 'flat'}
                                size="lg"
                                color="primary"
                                onPress={() => {
                                    setActiveSection('turbo'); // si tu veux garder cet état
                                    router.push('/delivery');      // redirection
                                }}
                                className={`w-full sm:w-1/2 px-6 py-3 rounded-md font-semibold transition-transform duration-150 flex items-center justify-center gap-3 ${
                                    activeSection === 'turbo'
                                    ? 'shadow-md scale-105'
                                    : 'hover:scale-105 hover:shadow-sm'
                                }`}
                                >
                                    <TbTruckDelivery className="h-5 w-5" />
                                    <span>Demande de TURBOY</span>
                                </Button>

                                <Button
                                variant={activeSection === 'orders' ? 'solid' : 'flat'}
                                size="lg"
                                color="secondary"
                                onPress={() => {
                                    setActiveSection('orders')
                                }}
                                className={`w-full sm:w-1/2 px-6 py-3 font-semibold rounded-md transition-transform duration-150 flex items-center justify-center gap-3 ${
                                    activeSection === 'orders'
                                    ? 'shadow-md scale-105'
                                    : 'hover:scale-105 hover:shadow-sm'
                                }`}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    <span>Suivi De Commandes</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* contenu scrollable dessous */}
                    <div className="mt-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
