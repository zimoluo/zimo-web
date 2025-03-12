"use client";

import { ReactNode, RefObject, useEffect, useRef } from "react";
import menuStyle from "./menu.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  children?: ReactNode;
}

export default function MenuSlideWrapper({
  isOpen,
  onClose,
  children,
  menuButtonRef,
}: Props) {
  const menuWrapperRef = useRef<HTMLDivElement>(null);

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
        target === menuButtonRef.current
      ) {
        return;
      }

      if (typeof window !== "undefined" && window.innerWidth < 768) {
        return;
      }

      if (
        menuWrapperRef.current &&
        !menuWrapperRef.current.contains(target) &&
        isOpen
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <aside
      aria-hidden={!isOpen}
      ref={menuWrapperRef}
      className={`fixed top-0 right-0 z-40 h-dynamic-screen ${
        menuStyle.menuSlideWidth
      } bg-widget-60 md:rounded-l-xl md:shadow-lg md:backdrop-blur-2xl transition-all duration-300 md:duration-200 ease-out ${
        isOpen
          ? `backdrop-blur-2xl translate-y-0 md:translate-x-0`
          : "-translate-y-full md:translate-y-0 md:translate-x-full invisible"
      }`}
    >
      {children}
    </aside>
  );
}
