"use client";

import { useState } from "react";
import {
  IconBuildingStore,
  IconCalendar,
  IconHome,
  IconInbox,
  IconMenu2,
  IconSearch,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { Navbar, NavbarContent } from "@nextui-org/navbar";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Progress } from "@nextui-org/progress";
import Link from "next/link";

import { StackedAreaChart } from "@/components/workspaces/dashboard/StackedAreas";
import { Traffic } from "@/components/workspaces/dashboard/Traffic";
import { TwoAreasChart } from "@/components/workspaces/dashboard/AreaCharts";
import { SimpleBarChart } from "@/components/workspaces/dashboard/BarChart";
import { StackedCards } from "@/components/workspaces/dashboard/Overview";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Page() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const menuItems = [
    {
      key: "chiffre_d_affaire",
      icon: <IconHome size={16} />,
      title: "Chiffre d'affaire",
    },
    {
      key: "properties",
      icon: <IconBuildingStore size={16} />,
      title: "Biens",
    },
    { key: "booking", icon: <IconCalendar size={16} />, title: "Réservations" },
    {
      key: "client",
      icon: <IconUsers size={16} />,
      title: "Satisfactions client",
    },
    { key: "issues", icon: <IconInbox size={16} />, title: "Problèmes" },
  ];
  const renderNav = () => {
    return (
      <nav className="flex flex-col gap-4 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            className="flex items-center hover:text-primary transition-all gap-2 text-sm"
            href="#"
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
    );
  };
  const renderPlanCard = () => {
    return isBannerVisible ? (
      <Card className="p-4">
        <Button
          isIconOnly
          className="absolute right-2 top-2"
          size="sm"
          variant="light"
          onPress={() => setIsBannerVisible(false)}
        >
          <IconX size={16} />
        </Button>
        <p className="text-sm font-semibold">Storage almost full</p>
        <p className="mt-2 text-xs">Upgrade your plan to get more storage</p>
        <Progress className="mt-4" color="warning" size="sm" value={80} />
        <Button className="mt-4" color="primary" size="sm" variant="flat">
          Upgrade plan
        </Button>
      </Card>
    ) : (
      <></>
    );
  };

  return (
    <div className="relative grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden md:block border-r">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="mt-4">
            <Input
              className="w-full"
              placeholder="Recherche ..."
              startContent={<IconSearch className="text-default-400" />}
            />
          </div>
          <div className="flex-1 px-4">{renderNav()}</div>
          <div className="w-full space-y-4 relative">{renderPlanCard()}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <Navbar className="max-h-16 z-[1]">
          <NavbarContent justify="start">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  isIconOnly
                  aria-label="Toggle navigation menu"
                  className="md:hidden"
                  variant="light"
                >
                  <IconMenu2 className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                {renderNav()}
                <div className="w-full space-y-4 relative mt-8">
                  {renderPlanCard()}
                </div>
              </SheetContent>
            </Sheet>
          </NavbarContent>
          <NavbarContent className="flex-grow" justify="center" />
          <NavbarContent justify="end" />
        </Navbar>

        <main className="flex flex-1 flex-col gap-4 lg:gap-6 p-4">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <div className="space-y-6">
            <StackedCards />
            <div className="grid gap-6 lg:grid-cols-2">
              <TwoAreasChart />
              <SimpleBarChart />
              <Traffic />
              <StackedAreaChart />
            </div>
            {/* <Orders /> */}
          </div>
        </main>
      </div>
    </div>
  );
}
