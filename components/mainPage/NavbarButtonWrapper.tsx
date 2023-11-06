"use client";

import React, { ReactNode, useMemo } from "react";
import Link from "next/link";
import { iconTextMap } from "@/lib/constants/iconMaps";
import { usePathname } from "next/navigation";
import navbarStyle from "./navbar.module.css";

type Props = {
  item: "photos" | "blog" | "projects" | "about";
  children?: ReactNode;
};

export default function NavbarButtonWrapper({ item, children }: Props) {
  const pathname = usePathname();

  const isCurrent = useMemo(() => {
    return pathname.startsWith(`/${item}`);
  }, [pathname, item]);

  return (
    <Link href={`/${item}`}>
      <div className="group font-bold cursor-pointer flex items-center justify-center">
        <div className="h-6 md:mr-2 relative">
          {isCurrent && (
            <div
              className={`${navbarStyle["item-shadow"]} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0 -z-5 w-auto aspect-square rounded-full`}
            />
          )}
          {children}
        </div>
        <div className="text-xl hidden md:block">{iconTextMap[item]}</div>
      </div>
    </Link>
  );
}
