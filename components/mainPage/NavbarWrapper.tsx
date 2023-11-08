"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import navbarStyle from "./navbar.module.css";
import SettingsPanelIcon from "../images/navigation/SettingsPanelIcon";
import MenuSlideWrapper from "./menu/MenuSlideWrapper";

interface Props {
  children?: ReactNode;
  menuContent?: ReactNode;
}

export default function NavbarWrapper({ children, menuContent }: Props) {
  const { settings } = useSettings();

  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarExpanded, setNavbarExpanded] = useState(true);

  const scrollThreshold = 4;

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuButtonRotation, setMenuButtonRotation] = useState(false);
  const [menuButtonTranslation, setMenuButtonTranslation] = useState(false);

  const openMenu = () => {
    setNavbarExpanded(true);
    setMenuOpen(true);

    setMenuButtonTranslation(true);
    setTimeout(() => {
      setMenuButtonRotation(true);
    }, 100);
  };

  const restoreNavbar = () => {
    setNavbarExpanded(true);
    setMenuOpen(false);

    setMenuButtonRotation(false);
    setTimeout(() => {
      setMenuButtonTranslation(false);
    }, 100);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const distanceScrolled = Math.abs(currentScrollY - lastScrollY);

      setScrollY(currentScrollY);

      if (currentScrollY < 40) {
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
      <div
        id="navbar"
        className={`h-12 transition-all duration-300 ease-out fixed w-full top-0 z-20 ${
          navbarExpanded ? "" : "-translate-y-14"
        } ${scrollY > 25 ? navbarStyle["scrolling"] : navbarStyle["on-top"]} ${
          menuOpen ? "opacity-0" : "opacity-100"
        } ${scrollY > 25 && navbarExpanded ? "backdrop-blur-md" : ""}`}
      >
        {settings.navigationBar !== "disabled" && children}
      </div>
      <MenuSlideWrapper onClose={restoreNavbar} isOpen={menuOpen}>
        {menuContent}
      </MenuSlideWrapper>
      <button
        className={`fixed top-3 right-4 h-6 w-auto aspect-square hover:scale-110 transform transition-transform duration-300 z-40 ease-out ${
          navbarExpanded || menuOpen ? "" : `-translate-y-14`
        } `}
        onClick={menuOpen ? restoreNavbar : openMenu}
        id="menu-button"
      >
        <SettingsPanelIcon
          className={`absolute h-6 w-auto ${
            menuButtonTranslation ? "-translate-y-1/2" : "-translate-y-1/3"
          } ${
            menuButtonRotation ? "-rotate-45" : ""
          } pointer-events-none aspect-square transform transition-all duration-150`}
        />
        <SettingsPanelIcon
          className={`absolute h-6 w-auto ${
            menuButtonTranslation ? "-translate-y-1/2" : "-translate-y-2/3"
          } ${
            menuButtonRotation ? "rotate-45" : ""
          } pointer-events-none aspect-square transform transition-all duration-150`}
        />
      </button>
    </>
  );
}
