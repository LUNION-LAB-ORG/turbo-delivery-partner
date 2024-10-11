"use client";

import { IconPlus } from "@tabler/icons-react";
import React from "react";

import RoleAddContent from "./role-add-content";

import { title } from "@/components/primitives";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
export default function RoleTitleSection() {
  return (
    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      <div className="flex flex-col">
        <h1
          className={title({
            size: "h4",
          })}
        >
          Rôles
        </h1>
        <p className="text-sm text-muted-foreground">
          Gérer les rôles des membres de l&apos;organisation.
        </p>
      </div>
      <Drawer>
        <DrawerTrigger>
          <Button>
            <IconPlus className="size-4 mr-2" />
            Ajouter un rôle
          </Button>
        </DrawerTrigger>
        <RoleAddContent />
      </Drawer>
    </div>
  );
}
