import Link from "next/link";
import MenuNavigationEntryText from "./MenuNavigationEntryText";
import { iconImageMap } from "@/lib/constants/iconMaps";
import MenuNavigationEntryGlow from "./MenuNavigationEntryGlow";
import menuStyle from "./menu.module.css";

interface Props {
  item: NavigationKey;
  type?: "long" | "compact";
}

export default function MenuEntriesNavigation({ item, type = "long" }: Props) {
  const NavigationIcon = iconImageMap[item];

  return (
    <Link
      href={`/${
        item === "home"
          ? ""
          : item === "themeMaker"
          ? "design/theme-maker"
          : item
      }`}
      className={`${
        type === "compact" ? "h-20 rounded-3xl" : "h-12 rounded-full"
      } ${menuStyle.navigationBackgroundColor} ${
        type === "compact"
          ? "px-0.5 pt-3.5 sm:pt-3"
          : item === "home"
          ? "p-2.5"
          : "p-2.5 pr-0.5 md:pr-2.5"
      } shadow-sm border-reflect-pastel`}
    >
      <div
        className={`group cursor-pointer flex items-center justify-start gap-2 relative ${
          type === "compact" ? "flex-col" : ""
        }`}
      >
        <MenuNavigationEntryGlow item={item} type={type} />
        <NavigationIcon
          className={`relative h-7 w-auto aspect-square shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            item === "home" ? "visible" : ""
          }`}
        />
        <div
          className={`${
            item === "home" && type === "long"
              ? "absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 w-full"
              : "relative"
          } ${
            type === "long"
              ? "md:absolute md:top-1/2 md:-translate-x-1/2 md:left-1/2 md:-translate-y-1/2 md:w-full"
              : ""
          } text-center`}
        >
          <MenuNavigationEntryText item={item} />
        </div>
      </div>
    </Link>
  );
}
