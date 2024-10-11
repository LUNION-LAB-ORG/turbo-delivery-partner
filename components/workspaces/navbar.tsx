import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { IconBell } from "@tabler/icons-react";

import { Icone } from "../icons";
import Tabs from "../layout/tabs";
import UserProfileDropdown from "../layout/user-profile-dropdown";

import { Tables } from "@/types/supabase";
import { UserTeams } from "@/types";
import { TeamDropdown } from "@/components/workspaces/team-dropdown";

type Profile = Tables<"profiles">;

const Navbar = ({
  reference,
  profile,
  teams,
}: {
  reference: string;
  profile: Profile;
  teams: UserTeams | null;
}) => {
  return (
    <>
      <NextUINavbar
        shouldHideOnScroll
        className="p-1 pt-2  sm:p-2 sm:pt-4 "
        height={50}
        maxWidth="2xl"
      >
        <NavbarBrand className="space-x-2 sm:space-x-4">
          <Icone height={32} width={32} />
          <TeamDropdown reference={reference} teams={teams} />
        </NavbarBrand>
        <NavbarContent className="flex-grow" justify="center">
          {/* <div className="hidden md:block"><Search /></div> */}
        </NavbarContent>
        <NavbarContent justify="end">
          <div className="flex items-center gap-1">
            <Button isIconOnly aria-label="Notifications" variant="light">
              <IconBell className="h-5 w-5" />
            </Button>
            <UserProfileDropdown profile={profile} />
          </div>
        </NavbarContent>
      </NextUINavbar>
      <NextUINavbar
        isBlurred
        isBordered
        className="pt-2"
        height={50}
        maxWidth="2xl"
        position="sticky"
      >
        <NavbarContent className="overflow-hidden" justify="center">
          <Tabs reference={reference} />
        </NavbarContent>
      </NextUINavbar>
    </>
  );
};

export default Navbar;
