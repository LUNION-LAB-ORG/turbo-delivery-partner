import { auth } from '@/auth';
import Content from './content';
import React, { Suspense } from 'react';
import Loading from '@/components/layouts/loading';
import { rechercherCommandesExterne } from '@/src/actions/commandes.actions';

export default async function Page() {
    const session = await auth();

    const commandes = await rechercherCommandesExterne({
        restaurantId: session?.user?.restauranID,
        page: 0,
        size: 10,
    });

    return (
        <Suspense fallback={<Loading />}>
            <Content commandesInitiales={commandes} session={session} />
        </Suspense>
    );
}
