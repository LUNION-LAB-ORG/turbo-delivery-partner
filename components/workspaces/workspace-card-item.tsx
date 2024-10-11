import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  CardHeader,
  Avatar,
  Chip,
} from "@nextui-org/react";
import Link from "next/link";

import { body, title } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/date-formate";
import { Team } from "@/types";
import { AvatarGroupComponent } from "@/components/workspaces/avatar-group-component";

export function WorkspaceCardItem(team: Team): React.JSX.Element {
  return (
    <Card key={team.name} className="w-full max-w-md">
      <CardHeader className="flex justify-between items-start gap-3">
        <div>
          <Avatar
            showFallback
            name={
              team.name
                .split(" ")[0]
                ?.slice(0, team.name.split(" ").length > 1 ? 1 : 2)
                ?.toUpperCase() +
              (team.name.split(" ").length > 1
                ? team.name.split(" ")[1]?.slice(0, 1)?.toUpperCase()
                : "")
            }
            size="sm"
            src={team.logo!}
          />
          <div className="flex flex-col text-left ">
            <p className={title({ size: "h6" })}>
              {team.name + " "}
              <span className="text-gray-400">#{team.reference}</span>
            </p>
            <p className={cn(body({ size: "caption" }), "line-clamp-3")}>
              Crée le {formatDate(team.joined_at)}
            </p>
          </div>
        </div>
        <Chip color="primary" size="sm" variant="flat">
          {team.role}
        </Chip>
      </CardHeader>
      <CardBody>
        <p className={cn(body({ size: "caption" }), "line-clamp-3")}>
          {team.description}
        </p>
      </CardBody>
      <CardFooter className="flex justify-between items-center">
        <Button
          as={Link}
          color="primary"
          href={`/workspaces/${team.reference}`}
          size="sm"
        >
          Accéder
        </Button>
        <AvatarGroupComponent images={team.members} />
      </CardFooter>
    </Card>
  );
}
