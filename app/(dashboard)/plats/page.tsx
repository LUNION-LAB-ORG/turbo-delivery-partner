import React, { Suspense } from 'react';
import Loading from '@/components/layouts/loading';
import { getDishesGroupByCollection } from '@/src/actions/restaurant.actions';
import Content from './content';

export default async function Page() {
    const data = await getDishesGroupByCollection();

    return (
        <Suspense fallback={<Loading />}>
            <Content data={data} />
        </Suspense>
    );
}
