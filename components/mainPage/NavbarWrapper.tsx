"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import MenuSlideWrapper from "./menu/MenuSlideWrapper";
import ExpandMenuButton from "../widgets/ExpandMenuButton";

interface Props {
  children?: ReactNode;
  menuContent?: ReactNode;
}

export default function NavbarWrapper({ children, menuContent }: Props) {
  const { settings } = useSettings();

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarExpanded, setNavbarExpanded] = useState(true);

  const scrollThreshold = 4;

  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    setNavbarExpanded(true);
    setMenuOpen(true);
  };

  const restoreNavbar = () => {
    setNavbarExpanded(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const distanceScrolled = Math.abs(currentScrollY - lastScrollY);

      setScrollY(currentScrollY);

      if (currentScrollY < 60) {
        setNavbarExpanded(true);
      } else {
        if (distanceScrolled >= scrollThreshold) {
          if (currentScrollY > lastScrollY) {
            // Scrolling down
            if (!menuOpen && settings.navigationBar === "flexible")
              setNavbarExpanded(false);
          } else {
            // Scrolling up
            setNavbarExpanded(true);
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, menuOpen, scrollThreshold, settings.navigationBar]);

  useEffect(() => {
    setNavbarExpanded(true);
    setScrollY(window.scrollY);
  }, []);

  return (
    <>
      {settings.navigationBar !== "disabled" && (
        <div
          className={`h-12 transition-all duration-300 ease-out fixed w-full top-0 z-20 ${
            navbarExpanded ? "" : "-translate-y-14"
          } ${
            menuOpen
              ? "opacity-0 pointer-events-none select-none"
              : "opacity-100"
          }`}
        >
          <div
            className={`absolute w-full h-full top-0 left-0 bg-widget-40 transition-all duration-150 ease-out backdrop-blur-2xl ${
              scrollY > 25 && navbarExpanded ? "opacity-100" : "opacity-20"
            }`}
          />
          {children}
        </div>
      )}
      <MenuSlideWrapper
        onClose={restoreNavbar}
        isOpen={menuOpen}
        menuButtonRef={menuButtonRef}
      >
        {menuContent}
      </MenuSlideWrapper>
      <ExpandMenuButton
        className={`fixed top-3 right-4 z-40 ${
          navbarExpanded || menuOpen ? "" : "-translate-y-14"
        }`}
        isOpen={menuOpen}
        onClick={menuOpen ? restoreNavbar : openMenu}
        buttonRef={menuButtonRef}
      />
    </>
  );
}
