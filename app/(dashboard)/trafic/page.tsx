import { auth } from "@/auth";
import Content from './content';
import { getLivreurs } from '@/src/actions/trafic.actions';

export default async function Page() {
    const session = await auth();
    const data = (await getLivreurs(session?.user.restauranID ?? "")) ?? [];
    console.log(data);
    return (
        <Content data={data} />
    );
}
