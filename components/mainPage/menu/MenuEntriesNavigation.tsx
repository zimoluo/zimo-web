import Link from "next/link";
import MenuNavigationEntryText from "./MenuNavigationEntryText";
import { iconImageMap } from "@/lib/constants/iconMaps";

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
    <>
      <Link
        href={`/${
          item === "home"
            ? ""
            : item === "themeMaker"
            ? "design/theme-maker"
            : item
        }`}
      >
        <div className="group cursor-pointer flex items-center">
          <NavigationIcon
            className={`h-8 w-auto aspect-square transition-transform duration-300 group-hover:scale-110 ${
              item === "home" ? "visible" : ""
            }`}
          />
          <div className="flex-grow" />
          <MenuNavigationEntryText item={item} />
        </div>
      </Link>
      {hasBorder && (
        <div className="border-primary border-0.4 border-opacity-20" />
      )}
    </>
  );
}
