import Content from './content';
import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Loading from '@/components/layouts/loading';
import { findOneRestaurant } from '@/src/actions/restaurant.actions';
import { getPaginationCourseExterne } from '@/src/actions/courses.actions';

export default async function DeliveryPage() {
    const data = await findOneRestaurant();
    const restaurant = data?.restaurant;
    if (!restaurant) {
        redirect('/auth/signout');
    }

    const courses_externes = await getPaginationCourseExterne(restaurant.id ?? '', 0, 6);
    return (
        <Suspense fallback={<Loading />}>
            <Content initialData={courses_externes} restaurant={restaurant} />
        </Suspense>
    );
}
