"use client";

import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/card";

import { MembersList } from "@/components/workspaces/settings/members/member-list";
import MembersTable from "@/components/workspaces/settings/members/members-table";
import InvitationTable from "@/components/workspaces/invitations/invitation-table";

export default function Page() {
  return (
    <div className="w-full flex flex-col gap-4 lg:gap-6">
      <MembersList />
      <Tabs aria-label="Options" variant="underlined">
        <Tab key="members" title="Membres">
          <Card className="max-w-screen-lg p-1">
            <CardBody>
              <MembersTable />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="invitations" title="Invitations">
          <div className="max-w-screen-lg p-1">
            <InvitationTable />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
