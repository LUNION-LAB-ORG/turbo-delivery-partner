import React from "react";
import Link from "next/link";

import { getTeamByReference } from "@/src/actions/team.actions";
import { BillingPlan } from "@/components/workspaces/settings/billing/billing-plan";
import { BillingPaymentMethod } from "@/components/workspaces/settings/billing/billing-payment-method";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { title } from "@/components/primitives";

export default async function Page({
  params: { reference },
}: {
  params: { reference: string };
}) {
  const team = await getTeamByReference(reference);

  if (!team) return <div>Loading...</div>;

  return (
    <div className="min-h-full w-full flex flex-col gap-4 lg:gap-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="general">Paramètres</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Facturations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <div className="flex flex-col">
        <h1
          className={title({
            size: "h4",
          })}
        >
          Facturations
        </h1>
        <p className="text-sm text-muted-foreground">
          Gérer les facturations des abonnements.
        </p>
      </div>

      {/* Main content */}
      <BillingPlan id={team.id} name={"Plan Premium"} />
      <BillingPaymentMethod id={team.id} name={"Plan Premium"} />
    </div>
  );
}
