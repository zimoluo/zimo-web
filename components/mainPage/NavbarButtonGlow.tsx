"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import navbarStyle from "./navbar.module.css";

interface Props {
  item: NavigationKey;
}

export default function NavbarButtonGlow({ item }: Props) {
  const pathname = usePathname();

  const isCurrent = useMemo(() => {
    return pathname.startsWith(`/${item}`);
  }, [pathname, item]);

  return (
    <div
      className={`${
        navbarStyle["item-shadow"]
      } absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0 w-0 md:w-16 rounded-full transition-opacity duration-300 ease-in-out ${
        isCurrent ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
