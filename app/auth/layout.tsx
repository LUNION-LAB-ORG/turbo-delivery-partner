import { Link } from "@nextui-org/link";

import { NavbarAuth } from "@/components/auth/navbar-auth";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <NavbarAuth />
      <main className="overflow-hidden min-h-screen mx-auto">{children}</main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.lunion-lab.com"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">LUNION-LAB</p>
        </Link>
      </footer>
    </>
  );
}
