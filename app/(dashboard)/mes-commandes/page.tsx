import { auth } from '@/auth';
import Content from './content';
import React, { Suspense } from 'react';
import Loading from '@/components/layouts/loading';

export default async function Page() {
    const session = await auth();
    return (
        <Suspense fallback={<Loading />}>
            <Content />
        </Suspense>
    );
}
