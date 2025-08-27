import { auth } from "@/auth";
import Content from './content';
import { LivreurRestau } from '@/types/models';
import { getLivreurs } from '@/src/actions/trafic.actions';

export default async function Page() {
    const session = await auth();
    const data = (await getLivreurs(session?.user.restauranID ?? "")).map(
        (raw: LivreurRestau) => ({
          livreurId: raw.id,
          avatarUrl: raw.avatarUrl,
          nomComplet: `${raw.nom} ${raw.prenoms}`.trim(),
          telephone: raw.telephone,
          position: { longitude: 0, latitude: 0 }, // valeur par défaut
        })
      ) ?? [];
    return (<Content data={data} />);
}
