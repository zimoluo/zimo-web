"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import navbarStyle from "./navbar.module.css";

interface Props {
  item: "photos" | "blog" | "projects" | "about";
}

export default function NavbarButtonGlow({ item }: Props) {
  const pathname = usePathname();

  const isCurrent = useMemo(() => {
    return pathname.startsWith(`/${item}`);
  }, [pathname, item]);

  return (
    isCurrent && (
      <div
        className={`${navbarStyle["item-shadow"]} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0 -z-5 w-0 md:w-16 rounded-full`}
      />
    )
  );
}
