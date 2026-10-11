"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import MenuIcon from "../../../../ui/icons/entries/MenuIcon";
import { useNavigationUi } from "../../../navigation";
import menuStyle from "./menu.module.css";

const query = "(width < 532px)";
const subscribe = (changed: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", changed);
  return () => media.removeEventListener("change", changed);
};
type Props = { readonly onClose: () => void; readonly menuButtonRef: RefObject<HTMLButtonElement | null>; readonly navbarRef: RefObject<HTMLDivElement | null>; readonly children?: ReactNode };
export default function MenuSlideWrapper({ onClose, children, menuButtonRef, navbarRef }: Props) {
  const expanded = useNavigationUi(state => state.sideMenuExpanded);
  const mobile = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  const dialog = useRef<HTMLDialogElement>(null);
  const modal = useRef(false);
  useEffect(() => {
    const element = dialog.current;
    if (element === null) return;
    const focused = document.activeElement;
    const switching = element.open && modal.current !== mobile;
    if (switching) element.close();
    if (expanded && !element.open) {
      modal.current = mobile;
      if (mobile) element.showModal(); else element.show();
      if (focused instanceof HTMLElement && (!mobile || element.contains(focused))) focused.focus({ preventScroll: true });
    }
    if (!expanded && element.open) { element.close(); menuButtonRef.current?.focus({ preventScroll: true }); }
  }, [expanded, mobile, menuButtonRef]);
  useEffect(() => () => { if (dialog.current?.open) dialog.current.close(); }, []);
  useEffect(() => {
    if (!expanded || mobile) return;
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } };
    const pointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || dialog.current?.contains(target) || menuButtonRef.current?.contains(target) || navbarRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", key); document.addEventListener("pointerdown", pointer);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", pointer); };
  }, [expanded, mobile, menuButtonRef, navbarRef, onClose]);
  return <>
    <div className={`fixed top-0 right-0 z-side-menu bottom-[-50lvh] ${menuStyle.menuBlurDimension} backdrop-blur-[9px] ${expanded ? "opacity-100" : "opacity-0"} pointer-events-none select-none transition-opacity duration-300`} />
    <dialog ref={dialog} role={mobile ? "dialog" : "complementary"} aria-label="Site menu" aria-hidden={!expanded} className={menuStyle.siteMenu} onCancel={event => { event.preventDefault(); onClose(); }} onClose={() => { if (!dialog.current?.open && useNavigationUi.getState().sideMenuExpanded) onClose(); }}>
      {mobile && <button type="button" aria-label="Close menu" className={menuStyle.menuClose} onClick={onClose}><MenuIcon className="size-[26px]" isActive={expanded} /></button>}
      <div className={menuStyle.menuContent} style={{ maskImage: "linear-gradient(to bottom, transparent 0%, transparent 0.5rem, rgba(0,0,0,0.008) 0.6053rem, rgba(0,0,0,0.0309) 0.7105rem, rgba(0,0,0,0.0669) 0.8158rem, rgba(0,0,0,0.1143) 0.9211rem, rgba(0,0,0,0.1713) 1.0263rem, rgba(0,0,0,0.2362) 1.1316rem, rgba(0,0,0,0.3072) 1.2368rem, rgba(0,0,0,0.3826) 1.3421rem, rgba(0,0,0,0.4606) 1.4474rem, rgba(0,0,0,0.5394) 1.5526rem, rgba(0,0,0,0.6174) 1.6579rem, rgba(0,0,0,0.6928) 1.7632rem, rgba(0,0,0,0.7638) 1.8684rem, rgba(0,0,0,0.8287) 1.9737rem, rgba(0,0,0,0.8857) 2.0789rem, rgba(0,0,0,0.9331) 2.1842rem, rgba(0,0,0,0.9691) 2.2895rem, rgba(0,0,0,0.992) 2.3947rem, rgba(0,0,0,1) 2.5rem, rgba(0,0,0,1) calc(100% - 2.5rem), rgba(0,0,0,0.992) calc(100% - 2.3947rem), rgba(0,0,0,0.9691) calc(100% - 2.2895rem), rgba(0,0,0,0.9331) calc(100% - 2.1842rem), rgba(0,0,0,0.8857) calc(100% - 2.0789rem), rgba(0,0,0,0.8287) calc(100% - 1.9737rem), rgba(0,0,0,0.7638) calc(100% - 1.8684rem), rgba(0,0,0,0.6928) calc(100% - 1.7632rem), rgba(0,0,0,0.6174) calc(100% - 1.6579rem), rgba(0,0,0,0.5394) calc(100% - 1.5526rem), rgba(0,0,0,0.4606) calc(100% - 1.4474rem), rgba(0,0,0,0.3826) calc(100% - 1.3421rem), rgba(0,0,0,0.3072) calc(100% - 1.2368rem), rgba(0,0,0,0.2362) calc(100% - 1.1316rem), rgba(0,0,0,0.1713) calc(100% - 1.0263rem), rgba(0,0,0,0.1143) calc(100% - 0.9211rem), rgba(0,0,0,0.0669) calc(100% - 0.8158rem), rgba(0,0,0,0.0309) calc(100% - 0.7105rem), rgba(0,0,0,0.008) calc(100% - 0.6053rem), transparent calc(100% - 0.5rem), transparent 100%)" }}>{children}</div>
    </dialog>
  </>;
}
