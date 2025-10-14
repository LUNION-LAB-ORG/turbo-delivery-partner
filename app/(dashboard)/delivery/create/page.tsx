import Content from './content';
import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Loading from '@/components/layouts/loading';
import { findOneRestaurant, getAllFraisLivraison } from '@/src/actions/restaurant.actions';
  
export default async function Page() {
    const data = await findOneRestaurant();
    const restaurant = data?.restaurant;
    const fraisLivraisons = await getAllFraisLivraison(restaurant?.id ?? '');    
    if (!restaurant) {
        const baseUrl = process.env.NEXT_PUBLIC_API_HOST_URL || 'http://localhost:3000';
        redirect(`${baseUrl}/api/auth/signout`);
    }      

    return (
        <Suspense fallback={<Loading />}>
            <Content restaurant={restaurant} fraisLivraisons={fraisLivraisons} />
        </Suspense>
    );
}
