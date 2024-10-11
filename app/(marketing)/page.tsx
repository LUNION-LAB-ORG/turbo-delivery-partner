import { Suspense } from "react";

import ClientSection from "@/components/marketing/about/client-section";
import CallToActionSection from "@/components/marketing/about/cta-section";
import HeroSection from "@/components/marketing/about/hero-section";
import PricingSection from "@/components/marketing/about/pricing-section";
import Particles from "@/components/magicui/particles";
import { SphereMask } from "@/components/magicui/sphere-mask";
import FeatureSection from "@/components/marketing/about/features-section";

export default async function Home() {
  // Si l'utilisateur n'a pas de profil, rediriger vers la page d'authentification
  // const profile = await getUserProfile();

  // if (profile && profile.first_name === null) {
  //   const url = "/auth?step=3";

  //   redirect(url);
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeroSection />
      <ClientSection />
      <SphereMask />
      <FeatureSection />
      <PricingSection />
      <CallToActionSection />
      <Particles
        className="absolute inset-0 -z-10"
        color={"#ffffff"}
        ease={70}
        quantity={50}
        size={0.05}
        staticity={40}
      />
    </Suspense>
  );
}
