"use client";

import { iconTextMap } from "@/lib/constants/iconMaps";
import { useNavigation } from "@/lib/navigationHook";

interface Props {
  item: NavigationKey;
}

export default function MenuNavigationEntryText({ item }: Props) {
  const navigationEntry = useNavigation();
  return (
    <div className={`ml-3 ${navigationEntry === item ? "font-bold" : ""}`}>
      {iconTextMap[item]}
    </div>
  );
}
