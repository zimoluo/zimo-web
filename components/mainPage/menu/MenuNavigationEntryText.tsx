"use client";

import { iconTextMap } from "@/lib/constants/iconMaps";
import { useNavigation } from "@/lib/helperHooks";
import { usePathname } from "next/navigation";

interface Props {
  item: NavigationKey;
}

export default function MenuNavigationEntryText({ item }: Props) {
  const navigationEntry = useNavigation();
  const pathname = usePathname();

  return (
    <div
      className={`${
        (item !== "home" && navigationEntry === item) ||
        (pathname === "/" && item === "home")
          ? "font-bold"
          : ""
      }`}
    >
      {iconTextMap[item]}
    </div>
  );
}
