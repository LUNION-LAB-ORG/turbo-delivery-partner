import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  Button
} from "@nextui-org/react";
import { IconBell } from "@tabler/icons-react";

import { Icone } from "../icons";

import { ProfileOrganisations } from "@/types/index.d";
import { OrganisationDropdown } from "@/components/layouts/organisation-dropdown";
import UserProfileDropdown from "../layouts/user-profile-dropdown";
import TabsD from "../layouts/tabs";


const Navbar = ({
  reference,
  profileOrganisations,
}: {
  reference: string;
  profileOrganisations: ProfileOrganisations | null;
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
          <OrganisationDropdown reference={reference} profileOrganisations={profileOrganisations} />
        </NavbarBrand>
        <NavbarContent className="flex-grow" justify="center">
          {/* <div className="hidden md:block"><Search /></div> */}
        </NavbarContent>
        <NavbarContent justify="end">
          <div className="flex items-center gap-1">
            <Button isIconOnly aria-label="Notifications" variant="light">
              <IconBell className="h-5 w-5" />
            </Button>
            <UserProfileDropdown />
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
          <TabsD reference={reference} />
        </NavbarContent>
      </NextUINavbar>
    </>
  );
};

export default Navbar;
