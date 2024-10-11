import { Navbar } from "@/components/layout/navbar";
import { SiteBanner } from "@/components/marketing/about/site-banner";
import { SiteFooter } from "@/components/marketing/about/site-footer";
import { getUserProfile } from "@/src/actions/auth.actions";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const profile = await getUserProfile();

  return (
    <>
      <SiteBanner />
      <Navbar profile={profile} />
      <main className="overflow-hidden container">{children}</main>
      <SiteFooter />
    </>
  );
}
