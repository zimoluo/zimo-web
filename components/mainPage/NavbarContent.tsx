import DisplayFavicon from "../assets/DisplayFavicon";
import Link from "next/link";
import navbarStyle from "./navbar.module.css";
import { iconImageMap, iconTextMap } from "@/lib/constants/iconMaps";
import NavbarGlow from "./NavbarGlow";
import NavbarExpandWrapper from "./NavbarExpandWrapper";
import NavbarWindowButton from "./NavbarWindowButton";
import NavbarSearchButton from "./NavbarSearchButton";

export default function NavbarContent() {
  return (
    <nav className={navbarStyle.header} aria-label="Primary navigation">
      <Link
        href="/"
        aria-label="Zimo Web home"
        className="mr-3 sm:mr-4 rounded-full h-12 sm:h-13 w-12 sm:w-13 flex items-center justify-center shadow-md sm:shadow-lg bg-light/65 backdrop-blur-sm border-reflect-light shrink-0 z-10 pointer-events-auto"
      >
        <DisplayFavicon className="h-[26px] w-[26px] sm:h-7 sm:w-7" />
      </Link>
      <div className={`${navbarStyle.navPosition} shrink-0`}>
        <NavbarExpandWrapper className="rounded-full backdrop-blur-sm">
          <div className="border-reflect-light bg-light/65 shadow-md sm:shadow-lg rounded-full h-12 sm:h-13 flex items-center justify-center overflow-hidden">
            {(
              [
                "photos",
                "blog",
                "projects",
                "design",
                "about",
              ] as NavigationKey[]
            ).map((src, index) => {
              const IconImage = iconImageMap[src];
              return (
                <Link
                  key={src}
                  href={`/${src}`}
                  aria-label={iconTextMap[src]}
                  className={`${
                    navbarStyle.navEntryGroup
                  } ${navbarStyle.destinationLink} flex items-center shrink-0 h-13 ${
                    index === 4 ? "pr-3 rounded-r-full" : "pr-2"
                  } ${index === 0 ? "pl-3 rounded-l-full" : "pl-2"} justify-center`}
                >
                  <div className={`${navbarStyle.destinationIcon} w-[26px] sm:w-7 h-[26px] sm:h-7 shrink-0 relative`} aria-hidden="true">
                    <NavbarGlow item={src} />
                    <IconImage className="w-[26px] sm:w-7 h-[26px] sm:h-7 relative" />
                  </div>
                  <div
                    className={`${navbarStyle.navEntry} transition-[max-width,opacity] ease-out duration-300`}
                  >
                    <div className="text-center text-base pl-2">
                      {iconTextMap[src]}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </NavbarExpandWrapper>
      </div>

      <div className={navbarStyle.searchPosition}><NavbarSearchButton /></div>

      <div
        className={`${navbarStyle.windowButton} shrink-0 rounded-full pointer-events-auto`}
        data-navbar-windows
      >
        <NavbarWindowButton />
      </div>
    </nav>
  );
}
