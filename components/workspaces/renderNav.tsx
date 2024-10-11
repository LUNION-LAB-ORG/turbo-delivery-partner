"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export default function RenderNav({
  reference,
  menu,
}: {
  reference: string;
  menu: {
    key: string;
    title: string;
  }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 mt-4">
      {menu.map((item) => {
        return (
          <Link
            key={item.key}
            className={cn(
              "flex items-center gap-2 hover:shadow-sm text-sm rounded-sm py-1 px-4 text-gray-600 hover:text-black dark:text-white/70 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all",
              pathname.includes(item.key) && "text-primary dark:text-primary",
            )}
            href={`/workspaces/${reference}/settings/${item.key}`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
