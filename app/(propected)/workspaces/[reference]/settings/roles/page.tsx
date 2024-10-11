import React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RoleTitleSection from "@/components/workspaces/settings/roles/role-title-section";
import RoleNoContent from "@/components/workspaces/settings/roles/role-no-content";

export default function Page({
  params: { reference },
}: {
  params: { reference: string };
}) {
  return (
    <main className="flex h-full flex-col gap-4 lg:gap-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="general">Paramètres</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Rôles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <RoleTitleSection />

      {/* Main content */}
      <RoleNoContent />
    </main>
  );
}
