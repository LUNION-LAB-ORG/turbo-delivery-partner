"use client";

import React from "react";
import { IconShieldLock } from "@tabler/icons-react";

export default function RoleNoContent() {
  return (
    <div className="flex min-h-[calc(100vh-300px)] h-full py-5 px-6 mt-4 flex-1 items-center justify-center rounded-lg border border-dashed">
      <div className="flex flex-col items-center gap-2 text-center">
        <IconShieldLock className="size-12 text-muted-foreground" />
        <p className="text-foreground">Aucun Rôle</p>
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez actuellement aucun rôle.
        </p>
      </div>
    </div>
  );
}
