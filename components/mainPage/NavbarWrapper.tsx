"use client";

import { ReactNode, useEffect, useRef } from "react";
import MenuSlideWrapper from "./menu/MenuSlideWrapper";
import { useNavigationUi, NavigationHost } from "@/src/features/navigation";
import navbarStyle from "./navbar.module.css";
import MenuIcon from "@/src/ui/icons/entries/MenuIcon";

interface Props {
  children?: ReactNode;
  menuContent?: ReactNode;
}

export default function NavbarWrapper({ children, menuContent }: Props) {
  const isSideMenuExpanded = useNavigationUi((state) => state.sideMenuExpanded);
  const setIsSideMenuExpanded = useNavigationUi((state) => state.setSideMenuExpanded);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = navbarRef.current;
    if (element === null) return;
    const measure = () => document.documentElement.style.setProperty("--zw-window-inset-top", `${Math.ceil(element.getBoundingClientRect().bottom + 8)}px`);
    measure();
    const observer = new ResizeObserver(measure); observer.observe(element);
    return () => observer.disconnect();
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
        className={`fixed top-0 z-chrome ${
          isSideMenuExpanded ? "w-[calc(100%-24.75rem)]" : "w-full"
        }  ${
          isSideMenuExpanded ? navbarStyle.squeezeEntireNavbarWhenMenuOpen : ""
        }  ${navbarStyle.navSidebarInteractionTransition} pointer-events-none`}
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
        <div className="w-full h-full shadow-md sm:shadow-lg rounded-full bg-panel/65 surface-edge" />
      </div>
      <div className="fixed top-2.5 right-2.5 sm:right-4 z-chrome h-12 w-12 sm:h-13 sm:w-13">
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
