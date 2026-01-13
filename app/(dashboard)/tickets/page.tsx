import { auth } from '@/auth';
import Content from './content';
import { getBonLivraisonStatsRequest, getBonLivraisonTerminees } from '@/src/actions/tickets.actions';

export default async function Page() {
    const session = await auth();
    const restaurantId = session?.user.restauranID;

    if (!restaurantId) {
        throw new Error('Restaurant ID introuvable');
    }

    const initialData = await getBonLivraisonTerminees({restaurantId});
    const initStats = await getBonLivraisonStatsRequest({restaurantId});

    return ( <Content initialData={initialData} restaurantId={restaurantId} initStats={initStats} /> );
}
