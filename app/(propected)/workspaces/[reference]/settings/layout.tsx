import { IconMenu2, IconSearch } from "@tabler/icons-react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { title } from "@/components/primitives";
import { PlanCard } from "@/components/workspaces/planCard";
import RenderNav from "@/components/workspaces/renderNav";

const menuItems: {
  key: string;
  title: string;
}[] = [
  {
    key: "general",
    title: "Général",
  },
  {
    key: "billing",
    title: "Facturation",
  },
  { key: "invoices", title: "Factures" },
  {
    key: "members",
    title: "Membres",
  },
  { key: "roles", title: "Rôles" },
];

export default function SettingLayout({
  children,
  params: { reference },
}: {
  children: React.ReactNode;
  params: { reference: string };
}) {
  return (
    <>
      <div className="flex items-center md:px-10">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button
              isIconOnly
              aria-label="Toggle navigation menu"
              variant="light"
            >
              <IconMenu2 className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
            <RenderNav menu={menuItems} reference={reference} />
            <div className="w-full space-y-4 relative mt-8">
              <PlanCard />
            </div>
          </SheetContent>
        </Sheet>
        <div>
          <p className={title({ size: "h4" })}>Paramètres</p>
        </div>
      </div>
      <div className="relative min-h-[calc(100vh-200px)] grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden h-full md:block border-r pr-4">
          <div className="flex flex-col gap-2">
            <div className="mt-4">
              <Input
                className="w-full"
                placeholder="Recherche ..."
                startContent={<IconSearch className="text-default-400" />}
              />
            </div>
            <div className="flex-1 px-4">
              <RenderNav menu={menuItems} reference={reference} />
            </div>
            <div className="w-full mt-6 space-y-4 relative">
              <PlanCard />
            </div>
          </div>
        </div>
        <main className="relative h-full flex-grow px-2 sm:px-4 py-8">
          {children}
        </main>
      </div>
    </>
  );
}
