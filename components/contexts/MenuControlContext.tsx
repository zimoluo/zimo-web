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
      sideMenuExpandedTrigger: boolean;
      openSideMenu: () => void;
    }
  | undefined
>(undefined);

export function MenuControlProvider({ children }: Props) {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const [isSideMenuExpanded, setIsSideMenuExpanded] = useState(false);
  const [sideMenuExpandedTrigger, setSideMenuExpandedTrigger] = useState(false);
  const { settings } = useSettings();

  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const triggerNavbarAnimation = useCallback(() => {
    setSideMenuExpandedTrigger(true);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      setSideMenuExpandedTrigger(false);
    }, 200);
  }, []);

  const setIsSideMenuExpandedWithTrigger = useCallback(
    (value: SetStateAction<boolean>) => {
      setIsSideMenuExpanded((prev) => {
        const newValue = typeof value === "function" ? value(prev) : value;
        if (newValue !== prev) {
          triggerNavbarAnimation();
        }
        return newValue;
      });
    },
    [triggerNavbarAnimation]
  );

  const toggleNavbarExpansion = useCallback(() => {
    setIsNavbarExpanded((prev) => !prev);
  }, []);

  const toggleSideMenuExpansion = useCallback(() => {
    setIsSideMenuExpandedWithTrigger((prev) => !prev);
  }, []);

  const openSideMenu = useCallback(() => {
    setIsSideMenuExpandedWithTrigger(true);
  }, [setIsSideMenuExpandedWithTrigger]);

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
    };
  }, [settings.navigationBar]);

  const contextValue = useMemo(
    () => ({
      isNavbarExpanded,
      setIsNavbarExpanded,
      isSideMenuExpanded,
      setIsSideMenuExpanded: setIsSideMenuExpandedWithTrigger,
      toggleNavbarExpansion,
      toggleSideMenuExpansion,
      sideMenuExpandedTrigger,
      openSideMenu,
    }),
    [
      isNavbarExpanded,
      isSideMenuExpanded,
      toggleNavbarExpansion,
      toggleSideMenuExpansion,
      sideMenuExpandedTrigger,
      setIsSideMenuExpandedWithTrigger,
      openSideMenu,
    ]
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
