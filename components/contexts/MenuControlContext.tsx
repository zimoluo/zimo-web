"use client";

import {
  createContext,
  ReactNode,
  SetStateAction,
  Dispatch,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  RefObject,
  use,
} from "react";
import { useSettings } from "./SettingsContext";

type Props = {
  children?: ReactNode;
};

export const MenuControlContext = createContext<
  | {
      isNavbarExpanded: boolean;
      setIsNavbarExpanded: Dispatch<SetStateAction<boolean>>;
      isSideMenuExpanded: boolean;
      setIsSideMenuExpanded: Dispatch<SetStateAction<boolean>>;
      toggleNavbarExpansion: () => void;
      toggleSideMenuExpansion: () => void;
      openSideMenu: () => void;
      searchOpenerRef: RefObject<HTMLElement | null>;
      openSearch: (opener?: HTMLElement) => void;
      isSearchOpen: boolean;
      setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export function MenuControlProvider({ children }: Props) {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const [isSideMenuExpanded, setIsSideMenuExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { settings } = useSettings();
  const searchOpenerRef = useRef<HTMLElement | null>(null);
  const openSearch = useCallback((opener?: HTMLElement) => {
    searchOpenerRef.current = opener ?? null;
    setIsSearchOpen(true);
  }, []);

  const toggleNavbarExpansion = useCallback(() => {
    setIsNavbarExpanded((prev) => !prev);
  }, []);

  const toggleSideMenuExpansion = useCallback(() => {
    setIsSideMenuExpanded((prev) => !prev);
  }, []);

  const openSideMenu = useCallback(() => {
    setIsSideMenuExpanded(true);
  }, [setIsSideMenuExpanded]);

  useEffect(() => {
    if (settings.navigationBar !== "flexible") {
      setIsNavbarExpanded(settings.navigationBar === "always");
      return;
    }

    let lastY = Math.max(0, window.scrollY);
    let direction = 0;
    let travel = 0;
    let frame: number | undefined;
    const handleScroll = () => {
      if (frame !== undefined || isSearchOpen) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY;
        lastY = y;
        const nextDirection = Math.sign(delta);
        travel = nextDirection === direction ? travel + Math.abs(delta) : Math.abs(delta);
        direction = nextDirection;
        const focused = document.activeElement?.closest("[data-navbar-destinations]");
        if (y < 24 || focused) setIsNavbarExpanded(true);
        else if (travel >= 12) setIsNavbarExpanded(direction < 0);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [settings.navigationBar, isSearchOpen]);

  const contextValue = useMemo(
    () => ({
      isNavbarExpanded,
      setIsNavbarExpanded,
      isSideMenuExpanded,
      setIsSideMenuExpanded,
      toggleNavbarExpansion,
      toggleSideMenuExpansion,
      openSideMenu,
      isSearchOpen,
      setIsSearchOpen,
      searchOpenerRef,
      openSearch,
    }),
    [
      isNavbarExpanded,
      isSideMenuExpanded,
      toggleNavbarExpansion,
      toggleSideMenuExpansion,
      openSideMenu,
      isSearchOpen,
      openSearch,
    ],
  );

  return (
    <MenuControlContext value={contextValue}>{children}</MenuControlContext>
  );
}

export const useMenuControl = () => {
  const context = use(MenuControlContext);
  if (context === undefined) {
    throw new Error("useMenuControl must be used within a MenuControlProvider");
  }
  return context;
};
