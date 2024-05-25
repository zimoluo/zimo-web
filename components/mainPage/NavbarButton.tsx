import React from "react";
import Link from "next/link";
import { iconImageMap, iconTextMap } from "@/lib/constants/iconMaps";
import NavbarButtonGlow from "./NavbarButtonGlow";

interface Props {
  item: NavigationKey;
}

export default function NavbarButton({ item }: Props) {
  const IconImage = iconImageMap[item];

  return (
    <Link href={`/${item}`}>
      <div className="group font-bold cursor-pointer flex items-center justify-center relative">
        <NavbarButtonGlow item={item} />
        <div className="h-6 md:mr-2 relative">
          <IconImage className="h-6 w-auto aspect-square transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="text-xl hidden md:block relative">
          {iconTextMap[item]}
        </div>
      </div>
    </Link>
  );
}
