"use client";

import { ReactNode, RefObject, useEffect, useRef } from "react";
import { useWindowAction } from "@/components/contexts/WindowActionContext";
import { useEntryWindow } from "../contexts/EntryWindowContext";

interface Props {
  children?: ReactNode;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  direction?: "left" | "right";
  maxWidth?: string;
  className?: string;
}

export default function WindowSlideMenuWrapper({
  children,
  menuButtonRef,
  direction = "left",
  maxWidth = "26rem",
  className = "",
}: Props) {
  const { isMenuOpen, slug, setIsMenuOpen } = useEntryWindow();
  const { windowContentRef, isActiveWindow } = useWindowAction();
  const menuWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActiveWindow) {
        return;
      }

      if (!slug) {
        return;
      }

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
  }, [isMenuOpen, setIsMenuOpen, slug, isActiveWindow]);

  return (
    <aside
      ref={menuWrapperRef}
      style={
        slug
          ? {
              width: `min(100%, ${maxWidth})`,
              transition:
                "transform 0.3s cubic-bezier(.37,.01,.11,.93), opacity 0.2s ease-out, visibility 0.3s ease-out, filter 0.3s ease-out",
            }
          : undefined
      }
      className={`absolute top-0 ${
        direction === "left"
          ? "left-0 origin-top-left"
          : "right-0 origin-top-right"
      } h-full ${slug ? "p-2" : "w-full bg-widget-90"} ${
        isMenuOpen
          ? `opacity-100 scale-100`
          : `scale-75 opacity-0 invisible blur`
      } ${className}`}
    >
      <div className="rounded-3xl bg-widget-100 ring-1 ring-highlight-light/15 shadow-lg backdrop-blur-[6px] w-full h-full">
        {children}
      </div>
    </aside>
  );
}
