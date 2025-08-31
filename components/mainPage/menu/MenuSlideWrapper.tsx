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
    <div
      className={`fixed top-0 right-0 z-40 h-dynamic-screen ${
        menuStyle.menuSlideWidth
      } p-2 ${
        isOpen
          ? `scale-100`
          : "scale-75 invisible pointer-events-none select-none"
      } origin-top-right`}
      ref={menuWrapperRef}
      aria-hidden={!isOpen}
      style={{
        transition:
          "transform 0.3s cubic-bezier(.37,.01,.11,.93), opacity 0.2s ease-out, scale 0.3s cubic-bezier(.37,.01,.11,.93), visibility 0.3s ease-out",
      }}
    >
      <aside
        className={`w-full h-full bg-widget-30 rounded-[2rem] shadow-lg backdrop-blur-[6px] transition-all duration-200 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </aside>
    </div>
  );
}
