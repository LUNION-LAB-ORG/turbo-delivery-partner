import React from "react";
import {
  IconCalendar,
  IconCrown,
  IconHeart,
  IconHome,
  IconMessage,
} from "@tabler/icons-react";

import { Separator } from "@/components/ui/separator";

import { Dock, DockIcon } from "@/components/magicui/dock";

export type IconProps = React.HTMLAttributes<SVGElement>;

export default function DockDemo() {
  return (
    <div className="fixed w-full bottom-4">
      <Dock
        className="w-full max-w-fit mx-auto"
        distance={100}
        magnification={60}
      >
        <DockIcon className="group dark:hover:bg-primary/20 hover:bg-primary/20 bg-black/10 dark:bg-white/10 p-3">
          <IconHome className="size-full group-hover:text-primary" />
        </DockIcon>
        <DockIcon className="group dark:hover:bg-primary/20 hover:bg-primary/20 bg-black/10 dark:bg-white/10 p-3">
          <IconHeart className="size-full group-hover:text-primary" />
        </DockIcon>
        <DockIcon className="group dark:hover:bg-primary/20 hover:bg-primary/20 bg-black/10 dark:bg-white/10 p-3">
          <IconMessage className="size-full group-hover:text-primary" />
        </DockIcon>
        <DockIcon className="group dark:hover:bg-primary/20 hover:bg-primary/20 bg-black/10 dark:bg-white/10 p-3">
          <IconCalendar className="size-full group-hover:text-primary" />
        </DockIcon>
        <Separator className="h-full" orientation="vertical" />
        <DockIcon className="group dark:hover:bg-primary/20 hover:bg-primary/20 bg-black/10 dark:bg-white/10 p-3">
          <IconCrown className="size-full group-hover:text-primary" />
        </DockIcon>
      </Dock>
    </div>
  );
}
