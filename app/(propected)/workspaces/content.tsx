"use client";

import React, { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { IconPlus, IconShare } from "@tabler/icons-react";
import Link from "next/link";

import { title } from "@/components/primitives";
import { Team, UserTeams } from "@/types";
import { useTabManage } from "@/components/layout/tabs";
import { WorkspaceCardItem } from "@/components/workspaces/workspace-card-item";

const WorkspaceContent = ({ teams }: { teams: UserTeams | null }) => {
  const { setTab } = useTabManage();

  useEffect(() => {
    setTab("overview");
  }, []);

  return (
    <main className="flex min-h-full flex-1 flex-col gap-4 lg:gap-6">
      <div className="flex items-center">
        <h1 className={title()}> Mes organisations</h1>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          as={Link}
          color="primary"
          href={`/workspaces/create_team`}
          size="sm"
          startContent={<IconPlus size={16} />}
        >
          Nouvelle organisation
        </Button>
        <Button
          as={Link}
          href={`/workspaces/invitations`}
          size="sm"
          startContent={<IconShare size={16} />}
          variant="bordered"
        >
          Invitations
        </Button>
      </div>
      <div className="flex w-full flex-1 px-2 sm:px-4 py-10 justify-center rounded-lg border border-dashed">
        <div className="flex w-full flex-col items-center gap-2 text-center">
          {teams &&
          (teams.teams.length > 0 || teams.shared_teams.length > 0) ? (
            <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.teams &&
                teams.teams.map((team: Team) => WorkspaceCardItem(team))}
              {teams.shared_teams &&
                teams.shared_teams.map((team: Team) => WorkspaceCardItem(team))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-2xl font-bold">
                Vous n&apos;avez pas d&apos;organisation
              </h3>
              <p className="text-sm text-foreground-500">
                Vous pouvez commencer à collaborer dès que vous créez ou
                rejoignez une organisation.
              </p>
              <Button
                as={Link}
                color="primary"
                href={`/workspaces/create_team`}
                size="sm"
                startContent={<IconPlus size={16} />}
              >
                Nouvelle organisation
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default WorkspaceContent;
