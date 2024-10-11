"use client";

import { Button } from "@nextui-org/button";
import { IconArrowRight } from "@tabler/icons-react";
import { useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

import { BorderBeam } from "@/components/magicui/border-beam";

export default function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8"
      id="hero"
    >
      <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
        <span className="bg-gradient-to-br to-primary bg-clip-text from-red-500">
          Lunion-Booking{" "}
        </span>{" "}
        Révolutionne votre gestion immobilière
      </h1>
      <p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
        Simplifiez votre activité immobilière comme un pro. <br /> Gérez
        efficacement vos biens, réservations et clients en un seul endroit.
      </p>
      <Button
        as={Link}
        className="translate-y-[-1rem] animate-fade-in gap-1 rounded-lg opacity-0 ease-in-out [--animation-delay:600ms]"
        color="primary"
        href="/workspaces"
      >
        <span>J&apos;accède à mon espace de travail</span>
        <IconArrowRight className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
      </Button>
      <div
        ref={ref}
        className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
      >
        <div
          className={`rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] ${
            inView ? "before:animate-image-glow" : ""
          }`}
        >
          <BorderBeam
            colorFrom="var(--color-one)"
            colorTo="var(--color-two)"
            delay={11}
            duration={12}
            size={200}
          />
          <img
            alt="/images/illustrations/dashboard.jpg"
            className="relative w-full h-full rounded-[inherit] border object-contain block"
            src="/images/illustrations/dashboard.jpg"
          />
        </div>
      </div>
    </section>
  );
}
