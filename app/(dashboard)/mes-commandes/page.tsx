import { auth } from '@/auth';
import Content from './content';
import React, { Suspense } from 'react';
import Loading from '@/components/layouts/loading';
import { getOrdersByRestaurantId } from '@/src/actions/commandes.actions';

export default async function Page() {
    const session = await auth();

    const commandes = await getOrdersByRestaurantId(session?.user?.restauranID ?? '');
    return (
        <Suspense fallback={<Loading />}>
            <Content commandesInitiales={commandes} session={session} />
        </Suspense>
    );
}
