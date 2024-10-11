"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { IconHeartFilled } from "@tabler/icons-react";

import UserProfileDropdown from "./user-profile-dropdown";

import { siteConfig } from "@/config/site";
import { Icone } from "@/components/icons";
import Search from "@/components/layout/search";
import { Profile } from "@/types";


export const Navbar = ({ profile }: { profile: Profile | null }) => {
  return (
    <NextUINavbar className="shadow-sm" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Icone />
            <p className="hidden sm:inline-block font-bold text-inherit">
              Lunion-Booking
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item: any) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <div className="hidden sm:inline-flex gap-1">
          <NavbarItem className="hidden lg:flex mx-1">
            <Search />
          </NavbarItem>
          <NavbarItem className="hidden md:flex gap-1">
            <UserProfileDropdown profile={profile} />
            {!profile && (
              <Button
                as={NextLink}
                className="text-sm font-normal text-default-600 bg-default-100"
                href={siteConfig.links.sponsor}
                startContent={<IconHeartFilled className="text-danger" />}
              >
                Sponsor
              </Button>
            )}
          </NavbarItem>
        </div>
      </NavbarContent>

      <NavbarContent className="md:hidden basis-1 pl-4" justify="end">
        <UserProfileDropdown profile={profile} />
      </NavbarContent>

      <NavbarMenu>
        <Search />
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item: any, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
