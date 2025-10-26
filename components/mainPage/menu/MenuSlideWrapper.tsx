"use client";

import { ReactNode, RefObject, useEffect, useRef } from "react";
import menuStyle from "./menu.module.css";
import { useMenuControl } from "@/components/contexts/MenuControlContext";

interface Props {
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  navbarRef: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
}

export default function MenuSlideWrapper({
  onClose,
  children,
  menuButtonRef,
  navbarRef,
}: Props) {
  const { isSideMenuExpanded } = useMenuControl();

  const menuWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(width < 480px)");

    const updateBodyOverflow = () => {
      if (mediaQuery.matches && isSideMenuExpanded) {
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
  }, [isSideMenuExpanded]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSideMenuExpanded) {
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

      if (navbarRef.current && navbarRef.current.contains(target)) {
        return;
      }

      if (
        typeof window !== "undefined" &&
        window.matchMedia("(width < 480px)").matches
      ) {
        return;
      }

      if (
        menuWrapperRef.current &&
        !menuWrapperRef.current.contains(target) &&
        isSideMenuExpanded
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
    <>
      <div
        className={`fixed top-[-50lvh] right-0 z-20 h-[200lvh] ${
          menuStyle.menuBlurDimension
        } backdrop-blur-[9px] ${
          isSideMenuExpanded ? "opacity-100" : "opacity-0"
        } pointer-events-none select-none transition-opacity duration-300 ease-out`}
      />
      <aside
        aria-hidden={!isSideMenuExpanded}
        ref={menuWrapperRef}
        style={{
          transition:
            "transform 0.3s cubic-bezier(.37,.01,.11,.93), opacity 0.18s ease-out, visibility 0.3s ease-out, filter 0.3s ease-out",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 0.5rem, rgba(0,0,0,0.008) 0.6053rem, rgba(0,0,0,0.0309) 0.7105rem, rgba(0,0,0,0.0669) 0.8158rem, rgba(0,0,0,0.1143) 0.9211rem, rgba(0,0,0,0.1713) 1.0263rem, rgba(0,0,0,0.2362) 1.1316rem, rgba(0,0,0,0.3072) 1.2368rem, rgba(0,0,0,0.3826) 1.3421rem, rgba(0,0,0,0.4606) 1.4474rem, rgba(0,0,0,0.5394) 1.5526rem, rgba(0,0,0,0.6174) 1.6579rem, rgba(0,0,0,0.6928) 1.7632rem, rgba(0,0,0,0.7638) 1.8684rem, rgba(0,0,0,0.8287) 1.9737rem, rgba(0,0,0,0.8857) 2.0789rem, rgba(0,0,0,0.9331) 2.1842rem, rgba(0,0,0,0.9691) 2.2895rem, rgba(0,0,0,0.992) 2.3947rem, rgba(0,0,0,1) 2.5rem, rgba(0,0,0,1) calc(100% - 2.5rem), rgba(0,0,0,0.992) calc(100% - 2.3947rem), rgba(0,0,0,0.9691) calc(100% - 2.2895rem), rgba(0,0,0,0.9331) calc(100% - 2.1842rem), rgba(0,0,0,0.8857) calc(100% - 2.0789rem), rgba(0,0,0,0.8287) calc(100% - 1.9737rem), rgba(0,0,0,0.7638) calc(100% - 1.8684rem), rgba(0,0,0,0.6928) calc(100% - 1.7632rem), rgba(0,0,0,0.6174) calc(100% - 1.6579rem), rgba(0,0,0,0.5394) calc(100% - 1.5526rem), rgba(0,0,0,0.4606) calc(100% - 1.4474rem), rgba(0,0,0,0.3826) calc(100% - 1.3421rem), rgba(0,0,0,0.3072) calc(100% - 1.2368rem), rgba(0,0,0,0.2362) calc(100% - 1.1316rem), rgba(0,0,0,0.1713) calc(100% - 1.0263rem), rgba(0,0,0,0.1143) calc(100% - 0.9211rem), rgba(0,0,0,0.0669) calc(100% - 0.8158rem), rgba(0,0,0,0.0309) calc(100% - 0.7105rem), rgba(0,0,0,0.008) calc(100% - 0.6053rem), transparent calc(100% - 0.5rem), transparent 100%)",
        }}
        className={`fixed top-0 right-0 z-20 h-dynamic-screen ${
          menuStyle.menuSlideWidth
        } py-2 ${
          isSideMenuExpanded
            ? `opacity-100 translate-y-0`
            : "invisible opacity-0 -translate-y-8 blur-[6px]"
        }`}
      >
        <div className="w-full h-full">{children}</div>
      </aside>
    </>
  );
}
