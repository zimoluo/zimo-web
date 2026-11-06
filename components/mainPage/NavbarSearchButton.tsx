"use client";

import { useMenuControl } from "../contexts/MenuControlContext";
import SearchBarIcon from "../assets/entries/SearchBarIcon";
import searchStyle from "./search.module.css";

interface Props {
  inMenu?: boolean;
}

export default function NavbarSearchButton({ inMenu = false }: Props) {
  const { isSearchOpen, openSearch } = useMenuControl();
  return (
    <button
      type="button"
      tabIndex={isSearchOpen ? -1 : 0}
      className={`${searchStyle.trigger} ${inMenu ? searchStyle.menuTrigger : searchStyle.navTrigger} bg-light/65 backdrop-blur-sm border-reflect-light shadow-lg`}
      data-search-trigger={inMenu ? "menu" : "navbar"}
      aria-label="Search Zimo Web"
      aria-haspopup="dialog"
      aria-expanded={isSearchOpen}
      aria-controls="site-search"
      aria-keyshortcuts="Meta+K Control+K"
      onClick={(event) => {
        event.currentTarget.focus({ preventScroll: true });
        openSearch(event.currentTarget);
      }}
    >
      <span aria-hidden="true"><SearchBarIcon className="h-5 w-5" /></span>
      <span className={searchStyle.triggerLabel}>Search Zimo Web</span>
      <kbd className={searchStyle.shortcut} data-search-shortcut>K</kbd>
    </button>
  );
}
