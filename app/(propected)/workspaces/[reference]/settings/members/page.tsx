import React from "react";
import Link from "next/link";

import Content from "./content";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { title } from "@/components/primitives";

export default function Page() {
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
            <BreadcrumbPage>Membres</BreadcrumbPage>
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
          Membres
        </h1>
        <p className="text-sm text-muted-foreground">
          Gérer les membres de l&apos;équipe et les invitations
        </p>
      </div>

      {/* Main content */}
      <Content />
    </div>
  );
}
