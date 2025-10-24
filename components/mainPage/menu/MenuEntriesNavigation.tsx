import Link from "next/link";
import MenuNavigationEntryText from "./MenuNavigationEntryText";
import { iconImageMap } from "@/lib/constants/iconMaps";
import MenuNavigationEntryGlow from "./MenuNavigationEntryGlow";

interface Props {
  item: NavigationKey;
  hasBorder?: boolean;
}

export default function MenuEntriesNavigation({
  item,
  hasBorder = true,
}: Props) {
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
      className="h-12 rounded-full bg-[color-mix(rgb(var(--color-pastel)_/_0.5)_0.45,rgb(var(--color-light)_/_0.5))] p-2.5 shadow-sm border-reflect-pastel"
    >
      <div className="group cursor-pointer flex items-center justify-start gap-3 relative">
        <MenuNavigationEntryGlow item={item} />
        <NavigationIcon
          className={`relative h-7 w-auto aspect-square transition-transform duration-300 group-hover:scale-110 ${
            item === "home" ? "visible" : ""
          }`}
        />
        <div
          className={`${
            item === "home"
              ? "absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 w-full"
              : "relative"
          } md:absolute md:top-1/2 md:-translate-x-1/2 md:left-1/2 md:-translate-y-1/2 md:w-full text-center`}
        >
          <MenuNavigationEntryText item={item} />
        </div>
      </div>
    </Link>
  );
}
