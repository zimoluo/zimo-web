import DisplayFavicon from "../assets/DisplayFavicon";
import Link from "next/link";
import navbarStyle from "./navbar.module.css";
import { iconImageMap, iconTextMap } from "@/lib/constants/iconMaps";
import NavbarGlow from "./NavbarGlow";
import NavbarExpandWrapper from "./NavbarExpandWrapper";
import NavbarWindowButton from "./NavbarWindowButton";

export default function NavbarContent() {
  return (
    <nav className="px-2.5 sm:px-4 w-full flex pt-2.5 relative">
      <Link
        href="/"
        className="mr-3 sm:mr-4 border-reflect rounded-full h-11 sm:h-13 w-11 sm:w-13 flex items-center justify-center shadow-md sm:shadow-lg bg-light/65 backdrop-blur-sm border-reflect-light shrink-0 z-10"
      >
        <DisplayFavicon className="h-6 w-6 sm:h-7 sm:w-7" />
      </Link>
      <div className={`${navbarStyle.navPosition} shrink-0`}>
        <NavbarExpandWrapper>
          <div className="border-reflect-light bg-light/65 shadow-md sm:shadow-lg backdrop-blur-sm rounded-full h-11 sm:h-13 flex items-center justify-center overflow-hidden">
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
                  key={index}
                  href={`/${src}`}
                  className={`${
                    navbarStyle.navEntryGroup
                  } flex items-center rounded-full shrink-0 h-13 ${
                    index === 4 ? "pr-3" : "pr-2"
                  } ${index === 0 ? "pl-3" : "pl-2"} justify-center`}
                >
                  <div className="w-6 sm:w-7 h-6 sm:h-7 shrink-0 relative">
                    <NavbarGlow item={src} />
                    <IconImage className="w-6 sm:w-7 h-6 sm:h-7 relative" />
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

      {/* the dynamic bar is postponed to phase 2. for now this part will be left empty */}
      <div
        className="flex-grow select-none pointer-events-none"
        aria-hidden="true"
      />

      <div className={`${navbarStyle.windowButton} mx-4 shrink-0 rounded-full`}>
        <NavbarWindowButton />
      </div>
      <div
        className="w-11 h-11 sm:h-13 sm:w-13 select-none pointer-events-none shrink-0"
        aria-hidden="true"
      />
    </nav>
  );
}
