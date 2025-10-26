"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import navbarStyle from "./navbar.module.css";

interface Props {
  item: NavigationKey;
}

export default function NavbarGlow({ item }: Props) {
  const pathname = usePathname();

  const isCurrent = useMemo(() => {
    return pathname.startsWith(`/${item}`);
  }, [pathname, item]);

  return (
    <div
      className={`w-7 h-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none transition-opacity duration-300 ease-out rounded-full ${
        isCurrent ? "opacity-50" : "opacity-0"
      } ${navbarStyle.glow}`}
    />
  );
}
