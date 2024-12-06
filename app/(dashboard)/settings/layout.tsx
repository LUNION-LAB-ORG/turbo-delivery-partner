import { title } from '@/components/primitives';
import { Card, CardBody } from '@nextui-org/react';
import '@smastrom/react-rating/style.css';

import { restaurants } from '@/data';
import RestaurantDetail from '@/components/dashboard/settings/restaurant-detail';

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
    const restaurant = restaurants[0];

    return (
        <div className="w-full h-full flex flex-1 flex-col gap-4 lg:gap-6">
            <div className="flex items-center">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>Paramètres</h1>
            </div>
            <div className="grid grid-cols-12 gap-6 lg:gap-4 justify-center">
                <Card className="w-full h-fit col-span-12 lg:col-span-4 2xl:col-span-5" shadow="sm">
                    <CardBody>
                        <RestaurantDetail restaurant={restaurant} />
                    </CardBody>
                </Card>
                <Card className="w-full col-span-12 lg:col-span-8 2xl:col-span-7 mb-10" shadow="sm">
                    <CardBody>{children}</CardBody>
                </Card>
            </div>
        </div>
    );
}
