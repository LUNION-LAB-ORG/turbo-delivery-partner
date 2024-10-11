import Content from "./content";

import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/marketing/about/site-footer";
import { getUserProfile } from "@/src/actions/auth.actions";
import { getUserTeams } from "@/src/actions/team.actions";

export default async function Page() {
  const profile = await getUserProfile();
  const teams: any = await getUserTeams();

  return (
    <>
      <Navbar profile={profile} />
      <main className="container min-h-[600px] overflow-hidden">
        <Content teams={teams} />
      </main>
      <SiteFooter />
    </>
  );
}
