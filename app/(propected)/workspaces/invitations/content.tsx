"use client";

import React from "react";
import { Button } from "@nextui-org/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { title } from "@/components/primitives";
import InvitationTable from "@/components/workspaces/invitations/invitation-table";

const InvitationsTable = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col gap-4 lg:gap-6 py-4">
      <div className="flex flex-col justify-center">
        <h1 className={title()}> Mes Invitations</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/workspaces">Espace de travail</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Invitations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
      </div>
      <InvitationTable />
    </div>
  );
};

export default InvitationsTable;
