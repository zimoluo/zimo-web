"use client";

import { iconTextMap } from "@/lib/constants/iconMaps";
import { getNavigation } from "@/lib/constants/navigationFinder";
import { usePathname } from "next/navigation";

interface Props {
  item: NavigationKey;
}

export default function MenuNavigationEntryText({ item }: Props) {
  const pathname = usePathname();
  const navigationEntry = getNavigation(pathname);
  return (
    <div className={`ml-3 ${navigationEntry === item ? "font-bold" : ""}`}>
      {iconTextMap[item]}
    </div>
  );
}
