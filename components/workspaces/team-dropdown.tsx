"use client";

import React, { useState } from "react";
import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import {
  IconCheck,
  IconChevronDown,
  IconList,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";

import { useTabManage } from "../layout/tabs";

import { Team, UserTeams } from "@/types";

export const TeamDropdown = ({
  reference,
  teams,
}: {
  reference: string;
  teams: UserTeams | null;
}) => {
  const [cuurentTeam, setCurrentTeam] = useState<string>(reference);
  const changeRoute = useTabManage().changeRoute;
  const selectedPerson = (teams?.teams.find(
    (team) => team.reference === cuurentTeam
  ) ??
    teams?.shared_teams.find((team) => team.reference === cuurentTeam)) as Team;

  const handleChangeTeam = (team: string) => {
    setCurrentTeam(team);
    changeRoute(`/workspaces/${team}`, "overview");
  };

  if (!teams) return <></>;

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="w-fit flex items-center cursor-pointer justify-start gap-2">
          <div className="flex items-center gap-2 max-w-fit">
            <Avatar
              showFallback
              as="button"
              className="transition-transform hidden sm:block"
              name={
                selectedPerson?.name
                  .split(" ")[0]
                  ?.slice(0, selectedPerson?.name.split(" ").length > 1 ? 1 : 2)
                  ?.toUpperCase() +
                (selectedPerson?.name.split(" ").length > 1
                  ? selectedPerson?.name
                      .split(" ")[1]
                      ?.slice(0, 1)
                      ?.toUpperCase()
                  : "")
              }
              size="sm"
              src={selectedPerson?.logo ?? ""}
            />
            <span className="text-xs sm:text-sm">{selectedPerson?.name}</span>
            <Chip color="primary" size="sm">
              {selectedPerson?.role}
            </Chip>
          </div>
          <IconChevronDown className="ml-auto h-4 w-4" />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions">
        <DropdownSection
          title={
            teams?.teams?.length > 0
              ? `Mes organisations (${teams?.teams?.length})`
              : ""
          }
        >
          {teams?.teams?.slice(0, 2)?.map((team) => (
            <DropdownItem
              key={team.name}
              variant="light"
              onClick={() => handleChangeTeam(team.reference)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Avatar
                    showFallback
                    alt={team.name}
                    name={
                      team?.name
                        .split(" ")[0]
                        ?.slice(0, team?.name.split(" ").length > 1 ? 1 : 2)
                        ?.toUpperCase() +
                      (team?.name.split(" ").length > 1
                        ? team?.name.split(" ")[1]?.slice(0, 1)?.toUpperCase()
                        : "")
                    }
                    size="sm"
                  />
                  <p className="ml-2">
                    {team.name + " "}
                    <span className="text-gray-400">#{team.reference}</span>
                  </p>
                </div>
                {team.reference === cuurentTeam && (
                  <IconCheck className="ml-2 text-primary" size={16} />
                )}
              </div>
            </DropdownItem>
          ))}
        </DropdownSection>
        <DropdownSection
          title={
            teams?.shared_teams?.length > 0
              ? `Mes organisations partagées (${teams?.shared_teams?.length})`
              : ""
          }
        >
          {teams?.shared_teams?.slice(0, 2)?.map((team) => (
            <DropdownItem
              key={team.name}
              variant="light"
              onClick={() => handleChangeTeam(team.reference)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Avatar
                    showFallback
                    alt={team.name}
                    name={
                      team?.name
                        .split(" ")[0]
                        ?.slice(0, team?.name.split(" ").length > 1 ? 1 : 2)
                        ?.toUpperCase() +
                      (team?.name.split(" ").length > 1
                        ? team?.name.split(" ")[1]?.slice(0, 1)?.toUpperCase()
                        : "")
                    }
                    size="sm"
                  />
                  <span className="ml-2">{team.name}</span>
                </div>
                {team.reference === cuurentTeam && (
                  <IconCheck className="ml-2 text-primary" size={16} />
                )}
              </div>
            </DropdownItem>
          ))}
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="add-team"
            showDivider
            as={Link}
            href="/workspaces/create_team"
            startContent={<IconPlus size={16} />}
            variant="light"
          >
            Nouvelle organisation
          </DropdownItem>
          <DropdownItem
            key="teams"
            as={Link}
            href="/workspaces"
            startContent={<IconList size={16} />}
            variant="light"
          >
            Afficher toutes les organisations
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
