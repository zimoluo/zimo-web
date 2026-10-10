"use client";

import type { NavigationKey } from "../../../../lib/navigation-types";
import { iconTextMap } from "../../../navigation/icons";
import { useNavigation } from "../../../navigation/use-navigation";
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
