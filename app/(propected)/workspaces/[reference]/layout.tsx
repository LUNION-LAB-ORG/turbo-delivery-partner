import React from "react";
import { redirect } from "next/navigation";

import { getUserProfile } from "@/src/actions/auth.actions";
import { getUserTeams } from "@/src/actions/team.actions";
import { Team, UserTeams } from "@/types";
import { memberBelongsToTeam } from "@/src/actions/member.actions";
import Navbar from "@/components/workspaces/navbar";

export default async function DashboardLayout({
  children,
  params: { reference },
}: {
  children: React.ReactNode;
  params: { reference: string };
}) {
  const teams: UserTeams | null = await getUserTeams();
  const team = teams && findTeamByReference(teams, reference);

  if (!team) redirect("/workspaces");

  const isBelongs = memberBelongsToTeam(team?.id);

  if (!isBelongs) redirect("/workspaces");
  const profile = await getUserProfile();

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar profile={profile} reference={reference} teams={teams} />
      <main className="relative overflow-auto min-h-[calc(100vh - 50px)] flex-grow p-4 container">
        {children}
      </main>
    </div>
  );
}

function findTeamByReference(
  data: UserTeams,
  reference: string,
): Team | undefined {
  let team = data.teams.find((team) => team.reference === reference);

  if (!team) {
    team = data.shared_teams.find(
      (sharedTeam) => sharedTeam.reference === reference,
    );
  }

  return team;
}
