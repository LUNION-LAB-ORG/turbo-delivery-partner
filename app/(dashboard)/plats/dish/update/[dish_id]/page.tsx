'use client';

import { useParams } from 'next/navigation';
import Content from './content';
import { getCollections, getDishComplet } from '@/src/actions/restaurant.actions';

export default async function Page() {
    const params = useParams() as { dish_id?: string };
    const dishId = params.dish_id;

    if (!dishId) {
        return <div>Plat introuvable</div>; // ou redirection
    }

    const dish = await getDishComplet(dishId);
    const collections = await getCollections()

    if (!dish) {
        return <div>Plat introuvable</div>; // Gestion du cas null
    }

    return (
        <div className="w-full h-full">
            <Content dish={dish} collections={collections} />
        </div>
    );
}
