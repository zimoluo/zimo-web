"use client";

import { ReactNode, useEffect, useRef } from "react";
import menuStyle from "./menu.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function MenuSlideWrapper({ isOpen, onClose, children }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateBodyOverflow = () => {
      if (mediaQuery.matches && isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    updateBodyOverflow();
    mediaQuery.addEventListener("change", updateBodyOverflow);

    // Cleanup
    return () => {
      document.body.style.overflow = "";
      mediaQuery.removeEventListener("change", updateBodyOverflow);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        target &&
        target instanceof HTMLElement &&
        target.id === "menu-button"
      ) {
        return;
      }

      if (typeof window !== "undefined" && window.innerWidth < 768) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target) && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <aside
      aria-hidden={!isOpen}
      ref={menuRef}
      className={`fixed top-0 right-0 z-40 h-screen ${
        menuStyle["menu-slide-width"]
      } bg-widget-30 rounded-l-xl md:shadow-lg md:backdrop-blur-xl transition-all duration-300 md:duration-200 ease-out ${
        isOpen
          ? `backdrop-blur-xl translate-y-0 md:translate-x-0`
          : "-translate-y-full md:translate-y-0 md:translate-x-full invisible"
      }`}
    >
      {children}
    </aside>
  );
}
