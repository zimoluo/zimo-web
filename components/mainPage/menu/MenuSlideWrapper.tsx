"use client";

import { ReactNode, RefObject, useLayoutEffect, useEffect, useRef, useSyncExternalStore } from "react";
import menuStyle from "./menu.module.css";
import { useMenuControl } from "@/components/contexts/MenuControlContext";
import MenuIcon from "../../assets/entries/MenuIcon";

interface Props {
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  navbarRef: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
}

const mobileQuery = "(width < 532px)";
const subscribeMobile = (changed: () => void) => {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", changed);
  return () => media.removeEventListener("change", changed);
};

export default function MenuSlideWrapper({ onClose, children, menuButtonRef, navbarRef }: Props) {
  const { isSideMenuExpanded, isSearchOpen } = useMenuControl();
  const mobile = useSyncExternalStore(subscribeMobile, () => window.matchMedia(mobileQuery).matches, () => false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef(false);

  useLayoutEffect(() => {
    const element = menuRef.current;
    if (!element) return;
    const focused = document.activeElement;
    if (element.open && modalRef.current !== mobile) {
      if (isSearchOpen) return;
      element.close();
    }
    if (isSideMenuExpanded && !element.open) {
      modalRef.current = mobile;
      if (mobile) element.showModal(); else element.show();
      if (focused instanceof HTMLElement && (!mobile || element.contains(focused))) focused.focus({ preventScroll: true });
      else if (mobile) closeRef.current?.focus({ preventScroll: true });
    }
    if (!isSideMenuExpanded && element.open) {
      const restoreFocus = element.contains(focused);
      element.close();
      if (restoreFocus) menuButtonRef.current?.focus({ preventScroll: true });
    }
  }, [isSideMenuExpanded, mobile, menuButtonRef, isSearchOpen]);

  useEffect(() => {
    if (!isSideMenuExpanded || !mobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [isSideMenuExpanded, mobile]);

  useEffect(() => {
    if (!isSideMenuExpanded || mobile) return;
    const key = (event: KeyboardEvent) => {
      if (!event.defaultPrevented && event.key === "Escape") { event.preventDefault(); onClose(); menuButtonRef.current?.focus({ preventScroll: true }); }
    };
    const pointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || menuRef.current?.contains(target) || menuButtonRef.current?.contains(target) || navbarRef.current?.contains(target) || (target instanceof Element && target.closest(":popover-open"))) return;
      onClose();
    };
    window.addEventListener("keydown", key);
    document.addEventListener("pointerdown", pointer);
    return () => { window.removeEventListener("keydown", key); document.removeEventListener("pointerdown", pointer); };
  }, [isSideMenuExpanded, mobile, onClose, menuButtonRef, navbarRef]);

  return (
    <>
      <div aria-hidden="true" className={`${menuStyle.menuBlur} fixed top-0 right-0 z-20 bottom-[-50lvh] ${menuStyle.menuBlurDimension} backdrop-blur-[9px] ${isSideMenuExpanded ? "opacity-100" : "opacity-0"} pointer-events-none select-none transition-opacity duration-300 ease-out`} />
      <dialog
        id="site-menu"
        inert={!isSideMenuExpanded}
        aria-hidden={!isSideMenuExpanded}
        ref={menuRef}
        className={menuStyle.menuSlide}
        aria-label="Site menu"
        onCancel={(event) => { event.preventDefault(); onClose(); }}
        onClose={() => { if (!menuRef.current?.open && isSideMenuExpanded) onClose(); }}
        onClick={(event) => {
          if (event.target === event.currentTarget && mobile) onClose();
          if (mobile && event.target instanceof Element && event.target.closest("a[href]")) onClose();
        }}
      >
        <div className={menuStyle.menuBody} style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 0.5rem, rgba(0,0,0,0.008) 0.6053rem, rgba(0,0,0,0.0309) 0.7105rem, rgba(0,0,0,0.0669) 0.8158rem, rgba(0,0,0,0.1143) 0.9211rem, rgba(0,0,0,0.1713) 1.0263rem, rgba(0,0,0,0.2362) 1.1316rem, rgba(0,0,0,0.3072) 1.2368rem, rgba(0,0,0,0.3826) 1.3421rem, rgba(0,0,0,0.4606) 1.4474rem, rgba(0,0,0,0.5394) 1.5526rem, rgba(0,0,0,0.6174) 1.6579rem, rgba(0,0,0,0.6928) 1.7632rem, rgba(0,0,0,0.7638) 1.8684rem, rgba(0,0,0,0.8287) 1.9737rem, rgba(0,0,0,0.8857) 2.0789rem, rgba(0,0,0,0.9331) 2.1842rem, rgba(0,0,0,0.9691) 2.2895rem, rgba(0,0,0,0.992) 2.3947rem, rgba(0,0,0,1) 2.5rem, rgba(0,0,0,1) calc(100% - 2.5rem), rgba(0,0,0,0.992) calc(100% - 2.3947rem), rgba(0,0,0,0.9691) calc(100% - 2.2895rem), rgba(0,0,0,0.9331) calc(100% - 2.1842rem), rgba(0,0,0,0.8857) calc(100% - 2.0789rem), rgba(0,0,0,0.8287) calc(100% - 1.9737rem), rgba(0,0,0,0.7638) calc(100% - 1.8684rem), rgba(0,0,0,0.6928) calc(100% - 1.7632rem), rgba(0,0,0,0.6174) calc(100% - 1.6579rem), rgba(0,0,0,0.5394) calc(100% - 1.5526rem), rgba(0,0,0,0.4606) calc(100% - 1.4474rem), rgba(0,0,0,0.3826) calc(100% - 1.3421rem), rgba(0,0,0,0.3072) calc(100% - 1.2368rem), rgba(0,0,0,0.2362) calc(100% - 1.1316rem), rgba(0,0,0,0.1713) calc(100% - 1.0263rem), rgba(0,0,0,0.1143) calc(100% - 0.9211rem), rgba(0,0,0,0.0669) calc(100% - 0.8158rem), rgba(0,0,0,0.0309) calc(100% - 0.7105rem), rgba(0,0,0,0.008) calc(100% - 0.6053rem), transparent calc(100% - 0.5rem), transparent 100%)",
        }}>{children}</div>
        <button ref={closeRef} type="button" aria-label="Close menu" className={`${menuStyle.closeMenu} h-12 w-12 rounded-full bg-light/65 backdrop-blur-sm border-reflect-light shadow-lg`} onClick={onClose}><MenuIcon className="h-[26px] w-[26px] pointer-events-none" isActive /></button>
      </dialog>
    </>
  );
}
