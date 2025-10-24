"use client";

import menuStyle from "./menu.module.css";
import { useNavigation } from "@/lib/helperHooks";

interface Props {
  item: NavigationKey;
}

export default function MenuNavigationEntryGlow({ item }: Props) {
  const navigation = useNavigation();

  return (
    <div
      className={`${
        menuStyle.glow
      } absolute left-3.5 top-1/2 -translate-y-1/2 -translate-x-1/2 h-7 w-7 pointer-events-none select-none rounded-full transition-opacity duration-300 ease-in-out ${
        navigation === item ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
