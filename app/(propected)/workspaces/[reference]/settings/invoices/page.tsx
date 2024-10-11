import { IconClipboardText } from "@tabler/icons-react";
import React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { title } from "@/components/primitives";
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
            <BreadcrumbPage>Factures</BreadcrumbPage>
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
          Factures
        </h1>
        <p className="text-sm text-muted-foreground">
          Gérer les factures des abonnements.
        </p>
      </div>

      {/* Main content */}
      <div className="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed">
        <div className="flex flex-col items-center gap-2 text-center">
          <IconClipboardText className="size-12 text-muted-foreground" />
          <p className="text-foreground">Aucune Factures</p>
          <p className="text-sm text-muted-foreground">
            Vous n&apos;avez actuellement aucune facture.
          </p>
        </div>
      </div>
    </main>
  );
}
