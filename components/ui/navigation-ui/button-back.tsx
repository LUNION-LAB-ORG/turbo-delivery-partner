"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props extends ButtonProps {
  children?: ReactNode;
}
export function ButtonBack({
  children = "Retour",
  ...props
}: Props): JSX.Element {
  const router = useRouter();

  return (
    <Button
      startContent={<IconChevronLeft size={20} />}
      variant="light"
      onClick={() => router.back()}
      {...props}
    >
      {children}
    </Button>
  );
}
