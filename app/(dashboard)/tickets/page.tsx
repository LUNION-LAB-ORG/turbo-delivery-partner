import { auth } from '@/auth';
import Content from './content';
import { getBonLivraisonTerminees } from '@/src/actions/tickets.actions';

export default async function Page() {
    const session = await auth();
    const initialData = await getBonLivraisonTerminees(session?.user.restauranID ?? "", 0, 10, { dates: { start: null, end: null } });
    return (
        <Content initialData={initialData} restaurantId={session?.user.restauranID} />
    );
}
