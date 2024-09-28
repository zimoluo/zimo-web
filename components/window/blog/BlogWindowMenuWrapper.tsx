"use client";

import { ReactNode, RefObject, useEffect, useRef } from "react";
import { useBlogWindow } from "../../contexts/BlogWindowContext";
import blogWindowStyle from "./blog-window.module.css";
import { useWindowAction } from "@/components/contexts/WindowActionContext";

interface Props {
  children?: ReactNode;
  menuButtonRef: RefObject<HTMLButtonElement>;
}

export default function BlogWindowMenuWrapper({
  children,
  menuButtonRef,
}: Props) {
  const { isMenuOpen, slug, setIsMenuOpen } = useBlogWindow();
  const { windowContentRef } = useWindowAction();
  const menuWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        event.preventDefault();
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!slug) {
        return;
      }

      const target = event.target as Node;

      if (
        target &&
        (target === menuButtonRef.current ||
          (windowContentRef &&
            windowContentRef.current &&
            !windowContentRef.current.contains(target)))
      ) {
        return;
      }

      if (typeof window !== "undefined" && window.innerWidth < 768) {
        return;
      }

      if (
        menuWrapperRef.current &&
        !menuWrapperRef.current.contains(target) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen, slug]);

  return (
    <aside
      aria-hidden={!isMenuOpen}
      ref={menuWrapperRef}
      className={`fixed top-0 left-0 z-10 h-full ${
        slug
          ? `${blogWindowStyle.menuWidth} rounded-r-xl bg-widget-100 backdrop-blur-xl`
          : "w-full bg-widget-80"
      } shadow-lg transition-all duration-200 ease-out ${
        isMenuOpen
          ? `backdrop-blur-2xl translate-x-0`
          : "-translate-x-full invisible"
      }`}
    >
      {children}
    </aside>
  );
}
