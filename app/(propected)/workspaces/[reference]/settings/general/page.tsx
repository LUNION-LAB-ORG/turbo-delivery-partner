import React from "react";

import { TeamName } from "@/components/workspaces/settings/general/team-name";
import { TeamDelete } from "@/components/workspaces/settings/general/team-delete";
import { TeamDescription } from "@/components/workspaces/settings/general/team-description";
import { TeamCoordonnees } from "@/components/workspaces/settings/general/team-coordonnees";
import { TeamEmail } from "@/components/workspaces/settings/general/team-email";
import { TeamPhone } from "@/components/workspaces/settings/general/team-phone";
import { TeamCategory } from "@/components/workspaces/settings/general/team-category";
import { ManagerInfo } from "@/components/workspaces/settings/general/manager-info";
import { getTeamByReference } from "@/src/actions/team.actions";

export default async function Page({
  params: { reference },
}: {
  params: { reference: string };
}) {
  const team = await getTeamByReference(reference);

  if (!team) return <div>Loading...</div>;

  return (
    <div className="min-h-full w-full flex flex-col gap-4 lg:gap-6">
      <TeamName id={team.id} name={team.name} />
      <TeamDescription description={team.description} id={team.id} />
      <TeamCategory category={team.category} id={team.id} />
      <TeamEmail email={team.email} id={team.id} />
      <TeamPhone id={team.id} phone_number={team.phone_number} />
      <TeamCoordonnees
        address={team.address}
        city={team.city}
        country={team.country}
        id={team.id}
      />
      <ManagerInfo
        id={team.id}
        manager_email={team.manager_email}
        manager_name={team.manager_name}
      />
      <TeamDelete id={team.id} userEmail={team.manager_email} />
    </div>
  );
}
