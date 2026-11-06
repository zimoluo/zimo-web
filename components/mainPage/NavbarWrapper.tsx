"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import MenuSlideWrapper from "./menu/MenuSlideWrapper";
import { useMenuControl } from "../contexts/MenuControlContext";
import navbarStyle from "./navbar.module.css";
import MenuIcon from "../assets/entries/MenuIcon";
import { useSettings } from "../contexts/SettingsContext";
import { calculateNavbarLayout } from "@/lib/navbarLayout";
import NavbarSearchPanel from "./NavbarSearchPanel";

interface Props {
  children?: ReactNode;
  menuContent?: ReactNode;
}

export default function NavbarWrapper({ children, menuContent }: Props) {
  const { isSideMenuExpanded, setIsSideMenuExpanded, isNavbarExpanded, setIsNavbarExpanded, isSearchOpen } =
    useMenuControl();

  const { settings } = useSettings();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isSideMenuExpanded, isNavbarExpanded });
  stateRef.current = { isSideMenuExpanded, isNavbarExpanded };

  useLayoutEffect(() => {
    const root = navbarRef.current;
    if (!root) return;
    let frame: number | undefined;
    const paint = () => {
      const state = stateRef.current;
      const layout = calculateNavbarLayout({ width: window.innerWidth, menuExpanded: state.isSideMenuExpanded, navbarExpanded: state.isNavbarExpanded });
      root.dataset.visible = String(layout.visible);
      root.inert = !layout.visible;
      root.setAttribute("aria-hidden", String(!layout.visible));
      const windows = root.querySelector<HTMLElement>("[data-navbar-windows]");
      if (windows) { windows.inert = !layout.windows; windows.setAttribute("aria-hidden", String(!layout.windows)); }
      if (!layout.visible) return;
      root.dataset.layout = layout.mode;
      root.dataset.labels = String(layout.labels);
      root.dataset.windows = String(layout.windows);
      for (const [name, value] of Object.entries({
        "--navbar-width": layout.span,
        "--navbar-height": layout.height,
        "--navbar-destinations-left": layout.destinationLeft,
        "--navbar-windows-left": layout.windowLeft,
        "--navbar-search-left": layout.searchLeft,
        "--navbar-search-top": layout.searchTop,
        "--navbar-search-width": layout.searchWidth,
      })) root.style.setProperty(name, `${value}px`);
    };
    const resize = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => { frame = undefined; paint(); });
    };
    paint();
    window.addEventListener("resize", resize, { passive: true });
    return () => { window.removeEventListener("resize", resize); if (frame !== undefined) cancelAnimationFrame(frame); };
  }, [isSideMenuExpanded, isNavbarExpanded]);

  const openMenu = () => {
    setIsSideMenuExpanded(true);
  };

  const restoreNavbar = () => {
    setIsSideMenuExpanded(false);
    if (settings.navigationBar !== "disabled") setIsNavbarExpanded(true);
  };

  return (
    <>
      <NavbarSearchPanel />
      <div
        className={`${navbarStyle.frame} fixed top-0 z-[21] pointer-events-none`}
        data-expanded={isNavbarExpanded}
        data-search-open={isSearchOpen}
        ref={navbarRef}
      >
        {children}
      </div>
      <MenuSlideWrapper
        onClose={restoreNavbar}
        menuButtonRef={menuButtonRef}
        navbarRef={navbarRef}
      >
        {menuContent}
      </MenuSlideWrapper>
      <div
        className={`fixed top-2.5 right-2.5 sm:right-4 z-30 h-12 w-12 sm:h-13 sm:w-13 pointer-events-none select-none transition-[filter,opacity] duration-200 ease-out ${
          isSideMenuExpanded ? "opacity-0 blur-[8px]" : "opacity-100"
        } rounded-full backdrop-blur-sm`}
      >
        <div className="w-full h-full shadow-md sm:shadow-lg rounded-full bg-light/65 border-reflect-light" />
      </div>
      <div className={`${navbarStyle.menuToggle} fixed top-2.5 right-2.5 sm:right-4 z-30 h-12 w-12 sm:h-13 sm:w-13`} data-open={isSideMenuExpanded}>
        <button
          type="button"
          aria-label={isSideMenuExpanded ? "Close menu" : "Open menu"}
          aria-expanded={isSideMenuExpanded}
          aria-controls="site-menu"
          className="w-full h-full flex items-center justify-center rounded-full"
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
