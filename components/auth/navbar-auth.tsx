import { Navbar as NextUINavbar, NavbarContent } from "@nextui-org/navbar";

import { ThemeSwitch } from "@/components/theme-switch";
import { ButtonBack } from "@/components/ui/navigation-ui/button-back";

export const NavbarAuth = () => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <ButtonBack />
      </NavbarContent>

      <NavbarContent className="basis-1 pl-4" justify="end">
        <ThemeSwitch />
      </NavbarContent>
    </NextUINavbar>
  );
};
