"use client";

import {
  createContext,
  ReactNode,
  SetStateAction,
  Dispatch,
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
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
    }
  | undefined
>(undefined);

export function MenuControlProvider({ children }: Props) {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const [isSideMenuExpanded, setIsSideMenuExpanded] = useState(false);
  const { settings } = useSettings();

  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const toggleNavbarExpansion = useCallback(() => {
    setIsNavbarExpanded((prev) => !prev);
  }, []);

  const toggleSideMenuExpansion = useCallback(() => {
    setIsSideMenuExpanded((prev) => !prev);
  }, []);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (settings.navigationBar !== "flexible") {
      setIsNavbarExpanded(settings.navigationBar === "always");
      return;
    }

    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY < 24) {
          setIsNavbarExpanded(true);
        } else if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
          const isScrollingDown = currentScrollY > lastScrollY.current;
          setIsNavbarExpanded(!isScrollingDown);
          lastScrollY.current = currentScrollY;
        }
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationTimeoutRef.current)
        clearTimeout(animationTimeoutRef.current);
    };
  }, [settings.navigationBar]);

  const contextValue = useMemo(
    () => ({
      isNavbarExpanded,
      setIsNavbarExpanded,
      isSideMenuExpanded,
      setIsSideMenuExpanded,
      toggleNavbarExpansion,
      toggleSideMenuExpansion,
    }),
    [isNavbarExpanded, isSideMenuExpanded]
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
