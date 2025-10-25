"use client";

import { ReactNode, useRef } from "react";
import { useSettings } from "../contexts/SettingsContext";
import MenuSlideWrapper from "./menu/MenuSlideWrapper";
import { useMenuControl } from "../contexts/MenuControlContext";
import SidebarToggleIcon from "../assets/entries/SidebarToggleIcon";
import navbarStyle from "./navbar.module.css";

interface Props {
  children?: ReactNode;
  menuContent?: ReactNode;
}

export default function NavbarWrapper({ children, menuContent }: Props) {
  const { settings } = useSettings();
  const { isSideMenuExpanded, setIsSideMenuExpanded, setIsNavbarExpanded } =
    useMenuControl();

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    setIsSideMenuExpanded(true);
  };

  const restoreNavbar = () => {
    setIsSideMenuExpanded(false);
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(width < 794px)").matches
    ) {
      setIsNavbarExpanded(true);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 z-[21] ${
          isSideMenuExpanded ? "w-[calc(100%-24.75rem)]" : "w-full"
        } ${
          isSideMenuExpanded ? navbarStyle.squeezeEntireNavbarWhenMenuOpen : ""
        } ${navbarStyle.navSidebarInteractionTransition}`}
      >
        <div className={`${navbarStyle.container} w-full`}>{children}</div>
      </div>
      <MenuSlideWrapper onClose={restoreNavbar} menuButtonRef={menuButtonRef}>
        {menuContent}
      </MenuSlideWrapper>
      <div
        className={`fixed top-2.5 right-2.5 sm:right-4 z-40 h-13 w-13 pointer-events-none select-none transition-opacity duration-200 ease-out ${
          isSideMenuExpanded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-full h-full shadow-lg rounded-full bg-light/65 backdrop-blur-sm border-reflect-light" />
      </div>
      <div className="fixed top-2.5 right-2.5 sm:right-4 z-40 h-13 w-13">
        <button
          className="w-full h-full flex items-center justify-center rounded-full"
          onClick={isSideMenuExpanded ? restoreNavbar : openMenu}
          ref={menuButtonRef}
        >
          <SidebarToggleIcon className="h-7 w-7 pointer-events-none" />
        </button>
      </div>
    </>
  );
}
