import { auth } from "@/auth";
import Content from "./content";
import { getTraficDelivers } from '@/src/actions/trafic.actions';

export default async function Page() {
    const session = await auth();

    const restaurantID = session?.user?.restauranID;
    const data = await getTraficDelivers(restaurantID);

    return <Content data={data} restaurantID={restaurantID || ''} />;
}
