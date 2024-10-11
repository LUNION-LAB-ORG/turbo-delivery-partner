"use client";

import { useEffect, useState, FC } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

import { IconSvgProps } from "@/types";

export const Icone: FC<IconSvgProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size = 36,
  width = 36,
  height = 36,
}) => {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Image
      alt="icone lunion-booking"
      height={typeof height == "string" ? parseInt(height) : height}
      src={theme == "light" ? "/images/icone.svg" : "/images/icone_fn.svg"}
      width={typeof width == "string" ? parseInt(width) : width}
    />
  );
};

export const Logo: React.FC<IconSvgProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size = 36,
  width = 36,
  height = 36,
}) => {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Image
      alt="logo lunion-booking"
      height={typeof height == "string" ? parseInt(height) : height}
      src={theme == "light" ? "/images/logo.svg" : "/images/logo_fn.svg"}
      width={typeof width == "string" ? parseInt(width) : width}
    />
  );
};
