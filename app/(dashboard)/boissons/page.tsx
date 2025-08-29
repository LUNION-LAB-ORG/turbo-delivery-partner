import Content from './content';
import { getBoissons } from '@/src/actions/restaurant.actions';
import { auth } from '@/auth';

export default async function Page() {
    const initialData = await getBoissons();
    return (
        <Content initialData={initialData} />
    );
}
