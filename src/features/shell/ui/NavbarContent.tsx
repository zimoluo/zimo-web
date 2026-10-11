
import { SurfaceRim } from "../../../ui/SurfaceRim";
import {ContextStrip} from "../../navigation";
import type { NavigationKey } from "../../../lib/navigation-types";
import { ThemeMark } from "../../theme";
import Link from "next/link";
import navbarStyle from "./navbar.module.css";
import { iconImageMap, iconTextMap } from "../../navigation/icons";
import NavbarGlow from "./NavbarGlow";
import NavbarExpandWrapper from "./NavbarExpandWrapper";
import NavbarWindowButton from "./NavbarWindowButton";

export default function NavbarContent() {
  return (
    <nav className={navbarStyle.header} aria-label="Primary navigation">
      <Link
        href="/"
        aria-label="Zimo Web home"
        className="mr-3 sm:mr-4 rounded-full h-12 sm:h-13 w-12 sm:w-13 flex items-center justify-center shadow-md sm:shadow-lg bg-panel/65 backdrop-blur-xs surface-edge shrink-0 z-content pointer-events-auto"
      >
        <ThemeMark primary className="h-[26px] w-[26px] sm:h-7 sm:w-7" />
      <SurfaceRim /></Link>
      <div className={navbarStyle.navPosition} data-navigation-anchor>
        <NavbarExpandWrapper className="rounded-full backdrop-blur-xs">
          <div className="surface-edge bg-panel/65 shadow-md sm:shadow-lg rounded-full h-12 sm:h-13 flex items-center justify-center overflow-hidden">
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
                  href={src === "photos" ? "/album" : `/${src}`}
                  className={`${
                    navbarStyle.navEntryGroup
                  } ${navbarStyle.destinationLink} flex items-center shrink-0 h-13 ${
                    index === 4 ? "pr-3 rounded-r-full" : "pr-2"
                  }  ${index === 0 ? "pl-3 rounded-l-full" : "pl-2"} justify-center`}
                >
                  <div className={`${navbarStyle.destinationIcon} w-[26px] sm:w-7 h-[26px] sm:h-7 shrink-0 relative`}>
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
          <SurfaceRim /></div>
        </NavbarExpandWrapper>
      </div>

      <ContextStrip />

      <div
        className={`${navbarStyle.windowButton} mx-4 shrink-0 rounded-full pointer-events-auto`}
        data-window-control
      >
        <NavbarWindowButton />
      </div>
      <div
        className="w-12 h-12 sm:h-13 sm:w-13 select-none pointer-events-none shrink-0"
        aria-hidden="true"
      />
    </nav>
  );
}
