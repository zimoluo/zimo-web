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
      } whitespace-nowrap text-[0.9375rem] leading-[1.375rem] sm:text-base`}
    >
      {iconTextMap[item]}
    </div>
  );
}
