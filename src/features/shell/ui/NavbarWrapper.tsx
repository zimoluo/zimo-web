"use client";
import { SurfaceRim } from "../../../ui/SurfaceRim";

import { type ReactNode, useEffect, useRef } from "react";
import MenuSlideWrapper from "./menu/MenuSlideWrapper";
import { useNavigationUi, NavigationHost } from "../../navigation";
import navbarStyle from "./navbar.module.css";
import MenuIcon from "../../../ui/icons/entries/MenuIcon";
import { attachNavigationBehavior } from "./navigation-behavior";

interface Props {
  children?: ReactNode;
  menuContent?: ReactNode;
}

export default function NavbarWrapper({ children, menuContent }: Props) {
  const isSideMenuExpanded = useNavigationUi((state) => state.sideMenuExpanded);
  const setIsSideMenuExpanded = useNavigationUi((state) => state.setSideMenuExpanded);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const behavior = useRef<ReturnType<typeof attachNavigationBehavior> | null>(null);

  useEffect(() => {
    const element = navbarRef.current;
    if (element === null) return;
    behavior.current = attachNavigationBehavior(element, menuButtonRef.current);
    return () => { behavior.current?.dispose(); behavior.current = null; };
  }, []);

  const openMenu = () => {
    setIsSideMenuExpanded(true);
  };

  const restoreNavbar = () => {
    setIsSideMenuExpanded(false);
  };

  return (
    <>
      <NavigationHost />
      <div
        className={`${navbarStyle.frame} fixed top-0 z-chrome pointer-events-none`}
        data-menu-open={isSideMenuExpanded}
        data-nav-expanded="true"
        data-context-strip="true"
        ref={navbarRef}
      >
        <div className={`${navbarStyle.container} w-full`}>{children}</div>
      </div>
      <MenuSlideWrapper
        onClose={restoreNavbar}
        menuButtonRef={menuButtonRef}
        navbarRef={navbarRef}
      >
        {menuContent}
      </MenuSlideWrapper>
      <div
        className={`fixed top-2.5 right-2.5 sm:right-4 z-chrome h-12 w-12 sm:h-13 sm:w-13 pointer-events-none select-none transition-[filter,opacity] duration-200 ease-out ${
          isSideMenuExpanded ? "opacity-0 blur-[8px]" : "opacity-100"
        } rounded-full backdrop-blur-xs`}
      >
        <div className="w-full h-full shadow-md sm:shadow-lg rounded-full bg-panel/65 surface-edge"><SurfaceRim /></div>
      </div>
      <div className={`${navbarStyle.menuToggle} fixed top-2.5 right-2.5 sm:right-4 z-chrome h-12 w-12 sm:h-13 sm:w-13`} data-open={isSideMenuExpanded}>
        <button
          className="w-full h-full flex items-center justify-center rounded-full"
          aria-label={isSideMenuExpanded ? "Close menu" : "Open menu"}
          aria-expanded={isSideMenuExpanded}
          onClick={isSideMenuExpanded ? restoreNavbar : openMenu}
          ref={menuButtonRef}
        >
          <MenuIcon
            className="h-[26px] w-[26px] sm:h-7 sm:w-7 pointer-events-none"
            isActive={isSideMenuExpanded}
          />
        </button>
      </div>
    </>
  );
}
