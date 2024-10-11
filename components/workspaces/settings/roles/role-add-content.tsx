"use client";

import React from "react";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { IconShieldLock } from "@tabler/icons-react";
import { Button } from "@nextui-org/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button as ButtonUI } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import { title } from "@/components/primitives";

export default function RoleAddContent() {
  return (
    <DrawerContent>
      <div className="flex flex-col gap-4 mx-auto w-full max-w-screen-md relative mt-4 p-1">
        <div className="flex flex-col gap-2">
          <h2 className={title({ size: "h3", className: "text-primary" })}>
            Ajouter un rôle
          </h2>
          <p className="text-sm text-gray-500">
            Ajoutez un rôle pour gérer les permissions des utilisateurs.
          </p>
        </div>
        <Divider />
        <Input
          label="Nom du rôle"
          labelPlacement="outside"
          placeholder="Saisissez le nom du rôle"
        />
        <ScrollArea className="h-[calc(100vh-22rem)] mt-4 ">
          <h2 className="font-semibold ml-2 text-muted-foreground">
            Choisir les autorisations
          </h2>
          <Accordion defaultExpandedKeys={["1"]}>
            <AccordionItem
              key="1"
              aria-label="Module 1"
              startContent={<IconShieldLock className="size-6 text-primary" />}
              subtitle={
                <span>Afficher les informations de l&apos;organisation</span>
              }
              title={
                <span className="font-semibold">
                  Module : Gestion d&apos;organisation
                </span>
              }
            >
              <div className="flex flex-col gap-2">
                <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ml-8">
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Afficher les informations de l&apos;organisation</p>
                  </div>
                  <ComboboxPopover />
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ml-8">
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Modifier les informations de l&apos;organisation</p>
                  </div>
                  <ComboboxPopover />
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ml-8">
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Supprimer les informations de l&apos;organisation</p>
                  </div>
                  <ComboboxPopover />
                </div>
              </div>
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Module 2"
              startContent={<IconShieldLock className="size-6 text-primary" />}
              subtitle={
                <span>Gérer les permissions de la gestion de propriété</span>
              }
              title={
                <span className="font-semibold">
                  Module : Gestion de propriété
                </span>
              }
            >
              <div className="flex flex-col gap-2">
                <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ml-8">
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Afficher les informations de la propriété</p>
                  </div>
                  <ComboboxPopover />
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ml-8">
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Modifier les informations de la propriété</p>
                  </div>
                  <ComboboxPopover />
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 ml-8">
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Supprimer une propriété</p>
                  </div>
                  <ComboboxPopover />
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        <Divider />
      </div>

      <DrawerFooter>
        <div className="flex w-full justify-between items-center gap-2 max-w-screen-md mx-auto">
          <DrawerClose>
            <ButtonUI size="sm" variant="secondary">
              Annuler
            </ButtonUI>
          </DrawerClose>
          <SubmitButton className="w-fit">Ajouter</SubmitButton>
        </div>
      </DrawerFooter>
    </DrawerContent>
  );
}

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "authorized",
    label: "Autorisé",
  },
  {
    value: "not_authorized",
    label: "Non autorisé",
  },
];

export function ComboboxPopover() {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-[150px]" size="sm">
          {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-[150px]" side="bottom">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(value) => {
                    setSelectedStatus(
                      statuses.find((priority) => priority.value === value) ||
                        null
                    );
                    setOpen(false);
                  }}
                >
                  <span>{status.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
