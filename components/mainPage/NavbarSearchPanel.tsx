"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMenuControl } from "../contexts/MenuControlContext";
import { useSettings } from "../contexts/SettingsContext";
import { useWindow } from "../contexts/WindowContext";
import { useToast } from "../contexts/ToastContext";
import { windowEntryMap } from "../window/WindowPickerEntry";
import { iconImageMap, iconTextMap } from "@/lib/constants/iconMaps";
import { getNavigation } from "@/lib/constants/navigationFinder";
import { allListedThemes } from "../theme/util/listedThemesMap";
import { parseSearchQuery, scoreSearchItem, type SearchableItem } from "@/lib/searchUtil";
import SearchBarIcon from "../assets/entries/SearchBarIcon";
import CrossIcon from "../assets/CrossIcon";
import CogIcon from "../assets/toast/CogIcon";
import DesignIcon from "../assets/navigation/DesignIcon";
import searchStyle from "./search.module.css";

interface SearchCommand extends SearchableItem {
  id: string;
  group: string;
  icon: typeof SearchBarIcon;
  href?: string;
  execute?: () => void;
  date?: string;
}

const destinations: NavigationKey[] = ["home", "photos", "blog", "projects", "design", "about", "themeMaker", "notebook", "management", "christmasTree"];
const pageKeywords: Partial<Record<NavigationKey, string[]>> = {
  photos: ["photos", "photography", "pictures"], blog: ["articles", "posts", "writing"],
  projects: ["portfolio", "work"], themeMaker: ["studio", "themes", "editor", "custom"],
  notebook: ["notes", "writing"],
};
const pathFor = (key: NavigationKey) => key === "home" ? "/" : key === "themeMaker" ? "/design/theme-maker" : key === "christmasTree" ? "/christmas-tree" : `/${key}`;
const sectionNames: Record<EntrySection, string> = { blog: "Blog", photos: "Album", projects: "Projects", management: "Management" };
const labelForTheme = (key: string) => key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());

function focusSearchDestination() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  const target = document.querySelector<HTMLElement>("main h1") ?? document.querySelector<HTMLElement>("main");
  if (!target) return;
  const previous = target.getAttribute("tabindex");
  target.tabIndex = -1;
  target.dataset.searchDestination = "";
  target.addEventListener("blur", () => {
    if (previous === null) target.removeAttribute("tabindex"); else target.setAttribute("tabindex", previous);
    delete target.dataset.searchDestination;
  }, { once: true });
  target.focus({ preventScroll: true });
}

export default function NavbarSearchPanel() {
  const { isSearchOpen, setIsSearchOpen, openSearch, searchOpenerRef, setIsSideMenuExpanded, openSideMenu } = useMenuControl();
  const { settings, updateSettings } = useSettings();
  const { appendWindow, windows, windowRefs, setActiveWindowByContextKey, setIsWindowMinimized } = useWindow();
  const { appendToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<() => void>(() => {});
  const openerRef = useRef<HTMLElement | null>(null);
  const sourceRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef(false);
  const loadedAtRef = useRef(0);
  const openRef = useRef(isSearchOpen);
  openRef.current = isSearchOpen;
  const [container, setContainer] = useState<HTMLDialogElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [entries, setEntries] = useState<SiteSearchEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const [help, setHelp] = useState(false);
  const previousPathRef = useRef(pathname);
  const navigationTargetRef = useRef<string | null>(null);
  const pendingWindowRef = useRef<{ key: WindowPickerEntry; previousIds: Set<string> } | null>(null);
  const commandActionsRef = useRef({ appendWindow, setActiveWindowByContextKey, setIsWindowMinimized, openSideMenu, updateSettings });
  useLayoutEffect(() => { commandActionsRef.current = { appendWindow, setActiveWindowByContextKey, setIsWindowMinimized, openSideMenu, updateSettings }; });

  useEffect(() => {
    const pending = pendingWindowRef.current;
    if (!pending) return;
    const index = windows.findIndex((instance) => instance.saveComponentKey === pending.key && !pending.previousIds.has(instance.uniqueId));
    const element = windowRefs[index]?.current;
    if (element) {
      pendingWindowRef.current = null;
      element.setAttribute("tabindex", "-1");
      element.setAttribute("role", "dialog");
      element.setAttribute("aria-label", windowEntryMap[pending.key].title);
      element.focus({ preventScroll: true });
    }
  }, [windows, windowRefs]);

  const close = (restoreFocus = false) => {
    openRef.current = false;
    restoreFocusRef.current = restoreFocus;
    setIsSearchOpen(false);
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const modifier = /Mac|iPhone|iPad/.test(navigator.platform) ? '"⌘"' : '"Ctrl"';
    document.documentElement.style.setProperty("--search-modifier", modifier);
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    const key = (event: KeyboardEvent) => {
      if (event.isComposing || event.defaultPrevented) return;
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        event.stopPropagation();
        if (event.repeat) return;
        if (openRef.current) closeRef.current(true);
        else openSearch(document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
      } else if (openRef.current && event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current(true);
      }
    };
    document.addEventListener("keydown", key, true);
    return () => { media.removeEventListener("change", update); document.removeEventListener("keydown", key, true); document.documentElement.style.removeProperty("--search-modifier"); };
  }, [openSearch]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (!isSearchOpen) {
      sourceRef.current?.removeAttribute("data-search-covered");
      if (panel.matches(":popover-open")) { positionRef.current(); panel.hidePopover(); }
      if (restoreFocusRef.current && openerRef.current?.isConnected && !openerRef.current.closest("[inert]")) openerRef.current.focus({ preventScroll: true });
      restoreFocusRef.current = false;
      return;
    }
    const modal = document.querySelector<HTMLDialogElement>("dialog:modal");
    if (container !== modal) { setContainer(modal); return; }

    // Capture the invoker before moving focus or exposing the popover. Each
    // opening owns its geometry; a previous navbar/menu session is never reused.
    openerRef.current = searchOpenerRef.current;
    const explicit = openerRef.current?.closest<HTMLElement>("[data-search-trigger]");
    const menuTrigger = document.querySelector<HTMLElement>('#site-menu[open] [data-search-trigger="menu"]');
    const navbarTrigger = document.querySelector<HTMLElement>('[data-search-trigger="navbar"]');
    const inMenu = container || openerRef.current?.closest("#site-menu") || navbarTrigger?.closest("[inert]");
    const source = explicit ?? (inMenu ? menuTrigger : navbarTrigger) ?? menuTrigger;
    const changedSource = sourceRef.current !== source;
    sourceRef.current?.removeAttribute("data-search-covered");
    sourceRef.current = source;
    setQuery(""); setActiveId(null); setHelp(false);

    const position = () => {
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const inset = width < 640 ? 10 : 16;
      const box = source?.getBoundingClientRect();
      const usable = box && !source?.closest('[data-visible="false"], [inert]') && box.width > 0 && box.left >= left && box.right <= left + width && box.top >= top && box.bottom <= top + height - 100;
      const panelWidth = Math.min(600, width - inset * 2);
      const x = Math.max(left + inset, Math.min(usable ? box.right - panelWidth : left + (width - panelWidth) / 2, left + width - panelWidth - inset));
      const y = Math.max(top + 10, Math.min(usable ? box.top : top + inset, top + height - 160));
      const fieldHeight = usable ? box.height : width < 640 ? 48 : 52;
      const availableHeight = Math.max(100, top + height - y - inset);
      const footerHeight = panel.querySelector<HTMLElement>("[data-search-footer]")?.getBoundingClientRect().height || 42;
      const contentSize = resultsRef.current ? Array.from(resultsRef.current.children).reduce((total, child) => {
        const style = getComputedStyle(child);
        return total + child.getBoundingClientRect().height + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }, 17) : 0;
      const contentHeight = Math.min(contentSize, 420, height * .54);
      for (const [name, value] of Object.entries({
        "--search-panel-left": x,
        "--search-panel-top": y,
        "--search-origin-left": usable ? box.left : x,
        "--search-origin-top": usable ? box.top : y,
        "--search-panel-width": panelWidth,
        "--search-origin-width": usable ? box.width : panelWidth,
        "--search-panel-height": Math.min(availableHeight, fieldHeight + contentHeight + footerHeight),
        "--search-available-height": availableHeight,
        "--search-field-height": fieldHeight,
      })) panel.style.setProperty(name, `${value}px`);
    };
    positionRef.current = position;
    position();
    // A different invoker starts a new entrance. Only a reversal from the same
    // invoker retains an in-flight CSS transition.
    if (changedSource && !panel.matches(":popover-open")) {
      panel.setAttribute("data-search-reset", "");
      panel.getBoundingClientRect();
      panel.removeAttribute("data-search-reset");
    }
    if (!panel.matches(":popover-open")) panel.showPopover();
    // Measuring again after display reveals intrinsic result/footer heights.
    position();
    source?.setAttribute("data-search-covered", "true");
    inputRef.current?.focus({ preventScroll: true });

    // The hidden invoker may finish its own menu/header transition. The open
    // sheet owns its position until viewport changes or dismissal; following
    // transitionend here would introduce a second, delayed correction.
    const resize = () => {
      // Viewport changes must constrain the sheet immediately, rather than
      // animating through coordinates that are now outside the visible screen.
      panel.setAttribute("data-search-reposition", "");
      position();
      panel.getBoundingClientRect();
      panel.removeAttribute("data-search-reposition");
    };
    window.addEventListener("resize", resize, { passive: true });
    window.visualViewport?.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("scroll", resize);
    const modalClosed = () => { if (!container?.open) closeRef.current(false); };
    container?.addEventListener("close", modalClosed);
    return () => {
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("scroll", resize);
      container?.removeEventListener("close", modalClosed);
    };
  }, [isSearchOpen, container, searchOpenerRef]);

  useEffect(() => {
    if (previousPathRef.current !== pathname) closeRef.current(false);
    previousPathRef.current = pathname;
    if (navigationTargetRef.current === pathname) {
      navigationTargetRef.current = null;
      focusSearchDestination();
    }
  }, [pathname]);

  useEffect(() => {
    if (!isSearchOpen || loadedAtRef.current > Date.now() - 300000) return;
    const controller = new AbortController();
    let current = true;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    setLoading(true);
    void fetch("/api/search", { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Search unavailable");
      const data: SiteSearchIndex = await response.json();
      if (!current) return;
      if (!Array.isArray(data.entries) || !Array.isArray(data.unavailable)) throw new Error("Invalid search index");
      setEntries(data.entries);
      setUnavailable(data.unavailable.length > 0);
      if (data.unavailable.length === 0) loadedAtRef.current = Date.now();
    }).catch(() => { if (current) setUnavailable(true); }).finally(() => { clearTimeout(timeout); if (current) setLoading(false); });
    return () => { current = false; clearTimeout(timeout); controller.abort(); setLoading(false); };
  }, [isSearchOpen, attempt]);

  const commands = useMemo<SearchCommand[]>(() => {
    const navigation = getNavigation(pathname);
    const openTool = (key: WindowPickerEntry) => {
      pendingWindowRef.current = null;
      const data = windowEntryMap[key].window;
      const contextKey = data.contextKey;
      commandActionsRef.current.setIsWindowMinimized(false);
      if (contextKey && windows.some((instance) => instance.contextKey === contextKey)) {
        commandActionsRef.current.setActiveWindowByContextKey(contextKey);
        const index = windows.findIndex((instance) => instance.contextKey === contextKey);
        windowRefs[index]?.current?.focus({ preventScroll: true });
        return;
      }
      if (!(data.countsToLimit ?? true) || windows.filter((instance) => instance.countsToLimit).length < settings.windowLimit) pendingWindowRef.current = { key, previousIds: new Set(windows.map((instance) => instance.uniqueId)) };
      commandActionsRef.current.appendWindow({ ...data, defaultCenterX: window.innerWidth / 2, defaultCenterY: window.innerHeight / 2, countsToLimit: data.countsToLimit ?? true, saveComponentKey: key });
    };
    return [
      ...destinations.map((key) => ({ id: `page:${key}`, group: "Pages", title: iconTextMap[key], description: key === "themeMaker" ? "Create and edit your themes" : `Go to ${iconTextMap[key]}`, icon: iconImageMap[key], href: pathFor(key), keywords: pageKeywords[key] ?? [] })),
      ...entries.map((entry) => ({ ...entry, id: `entry:${entry.section}:${entry.slug}`, group: sectionNames[entry.section], keywords: [sectionNames[entry.section], entry.section], icon: iconImageMap[entry.section], href: `/${entry.section}/${encodeURIComponent(entry.slug)}` })),
      { id: "settings:open", group: "Actions", title: "Open settings", description: "Appearance, reading, and preferences", icon: CogIcon, execute: () => { commandActionsRef.current.openSideMenu(); requestAnimationFrame(() => { const section = document.getElementById("site-settings"); section?.focus({ preventScroll: true }); section?.scrollIntoView({ block: "start", behavior: "instant" }); }); } },
      { id: "settings:serif", group: "Actions", title: settings.disableSerifFont ? "Use serif reading font" : "Use sans serif reading font", description: "Change your reading preference", icon: CogIcon, keywords: ["font", "typography"], execute: () => commandActionsRef.current.updateSettings({ disableSerifFont: !settings.disableSerifFont }) },
      { id: "settings:dark", group: "Actions", title: settings.darkModeThemesOverride ? "Use page themes" : "Use dark mode themes", description: "Change your existing dark theme preference", icon: DesignIcon, execute: () => commandActionsRef.current.updateSettings({ darkModeThemesOverride: !settings.darkModeThemesOverride }) },
      ...(desktop ? (Object.keys(windowEntryMap) as WindowPickerEntry[]).map((key) => ({ id: `tool:${key}`, group: "Tools", title: windowEntryMap[key].title, description: "Open a floating window", keywords: ["window", "widget", "open"], icon: windowEntryMap[key].icon, execute: () => openTool(key) })) : []),
      ...allListedThemes.map((key) => ({ id: `theme:${key}`, group: "Themes", title: labelForTheme(key), description: `Use this theme on ${iconTextMap[navigation]}`, keywords: ["theme", "appearance", "apply"], icon: DesignIcon, execute: () => commandActionsRef.current.updateSettings({ pageTheme: { ...settings.pageTheme, [navigation]: key }, darkModeThemesOverride: false }) })),
      ...settings.customThemeData.map((profile, index) => ({ id: `profile:${index}`, group: "Themes", title: `Your profile ${index + 1}`, description: `Use this profile on ${iconTextMap[navigation]}`, keywords: ["theme", "custom", "appearance", "apply"], icon: DesignIcon, execute: () => commandActionsRef.current.updateSettings({ pageTheme: { ...settings.pageTheme, [navigation]: profile }, darkModeThemesOverride: false }) })),
    ];
  }, [pathname, entries, desktop, settings, windows, windowRefs]);

  const groups = useMemo(() => {
    const terms = parseSearchQuery(query);
    const filtered = commands.flatMap((command, order) => {
      if (terms.length === 0 && (
        command.group === "Themes" || command.group === "Tools" ||
        command.group === "Pages" && !["page:photos", "page:blog", "page:projects", "page:themeMaker", "page:notebook"].includes(command.id) ||
        command.group === "Actions" && command.id !== "settings:open"
      )) return [];
      const score = scoreSearchItem(command, terms);
      return score === null ? [] : [{ command, score, order }];
    }).sort((a, b) => a.score - b.score || a.order - b.order);
    const byGroup = new Map<string, { command: SearchCommand; score: number }[]>();
    for (const match of filtered) {
      const group = terms.length === 0 && match.command.id.startsWith("entry:") ? "Recent entries" : match.command.group;
      const list = byGroup.get(group) ?? [];
      list.push(match);
      byGroup.set(group, list);
    }
    if (terms.length === 0) {
      const recent = byGroup.get("Recent entries");
      recent?.sort((a, b) => (b.command.date ?? "").localeCompare(a.command.date ?? ""));
      if (recent) byGroup.set("Recent entries", recent.slice(0, 5));
    }
    return [...byGroup].map(([name, items]) => ({ name, items: items.map((item) => item.command) }));
  }, [commands, query]);
  const results = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const selected = results.find((command) => command.id === activeId) ?? results[0];
  const selectedIndex = selected ? results.indexOf(selected) : -1;

  useLayoutEffect(() => {
    if (isSearchOpen) positionRef.current();
  }, [groups, loading, unavailable, help, isSearchOpen]);

  const selectedId = selected?.id;
  useEffect(() => {
    if (!isSearchOpen || !selectedId) return;
    const element = document.getElementById(`search-result-${encodeURIComponent(selectedId)}`);
    const list = resultsRef.current;
    if (!element || !list) return;
    const row = element.getBoundingClientRect();
    const viewport = list.getBoundingClientRect();
    if (row.top < viewport.top + 8) list.scrollTop += row.top - viewport.top - 8;
    else if (row.bottom > viewport.bottom - 8) list.scrollTop += row.bottom - viewport.bottom + 8;
  }, [selectedId, isSearchOpen]);

  const choose = (command: SearchCommand, newTab = false) => {
    close(command.id.startsWith("theme:") || command.id.startsWith("profile:") || command.id === "settings:serif" || command.id === "settings:dark");
    if (window.innerWidth < 768) setIsSideMenuExpanded(false);
    if (command.href) {
      if (newTab) window.open(command.href, "_blank", "noopener,noreferrer");
      else {
        if (command.href === pathname) {
          requestAnimationFrame(focusSearchDestination);
        } else { navigationTargetRef.current = command.href; router.push(command.href); }
      }
    } else {
      try { command.execute?.(); }
      catch { appendToast({ title: "Search", description: "That action could not be completed. Please try again.", icon: "search" }); }
    }
  };

  const panel = (
    <div
      ref={panelRef}
      id="site-search"
      popover="auto"
      inert={!isSearchOpen}
      aria-hidden={!isSearchOpen}
      role="dialog"
      aria-label="Search Zimo Web"
      className={`${searchStyle.panel} border-reflect-light`}
      onBlurCapture={(event) => {
        if (openRef.current && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) close(false);
      }}
      onBeforeToggle={(event) => {
        if ((event.nativeEvent as ToggleEvent).newState === "closed") {
          openRef.current = false;
          setIsSearchOpen(false);
        }
      }}
    >
      <div className={searchStyle.panelBody}>
        <div className={searchStyle.field}>
          <span aria-hidden="true"><SearchBarIcon className="h-5 w-5" /></span>
          <input
            ref={inputRef}
            className={searchStyle.input}
            type="text"
            role="combobox"
            aria-label="Search pages, entries, and commands"
            aria-expanded={isSearchOpen}
            aria-autocomplete="list"
            aria-controls="site-search-results"
            aria-activedescendant={selected ? `search-result-${encodeURIComponent(selected.id)}` : undefined}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Search Zimo Web…"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActiveId(null); resultsRef.current?.scrollTo({ top: 0 }); }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (results.length) setActiveId(results[(selectedIndex + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length].id);
              } else if (event.key === "Enter" && selected) { event.preventDefault(); choose(selected, event.metaKey || event.ctrlKey); }
            }}
          />
          <button type="button" className={searchStyle.close} aria-label="Close search" onClick={() => close(true)}><span aria-hidden="true"><CrossIcon isSaturated /></span></button>
        </div>
        <div ref={resultsRef} className={searchStyle.results}>
          <div id="site-search-results" role="listbox" aria-label="Search results" aria-busy={loading}>
          {groups.map((group, groupIndex) => (
            <div key={group.name} role="group" aria-labelledby={`search-group-${groupIndex}`}>
              <h2 id={`search-group-${groupIndex}`} className={searchStyle.groupTitle}>{group.name}</h2>
              {group.items.map((command) => {
                const Icon = command.icon;
                const content = <><span className={searchStyle.resultIcon} aria-hidden="true"><Icon className="h-full w-full" /></span><span className={searchStyle.resultText}><span className={searchStyle.resultTitle}>{command.title}</span><span className={searchStyle.resultDescription}>{command.description}</span></span><span className={searchStyle.resultHint} aria-hidden="true">{command.href ? "→" : "↵"}</span></>;
                const attributes = { id: `search-result-${encodeURIComponent(command.id)}`, role: "option", "aria-selected": command.id === selected?.id, tabIndex: -1, className: searchStyle.result, onPointerMove: () => setActiveId(command.id), onMouseDown: (event: React.MouseEvent) => event.preventDefault() };
                return command.href ? <Link key={command.id} {...attributes} href={command.href} prefetch={false} onClick={(event) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { close(false); return; } event.preventDefault(); choose(command); }}>{content}</Link> : <button key={command.id} {...attributes} type="button" onClick={() => choose(command)}>{content}</button>;
              })}
            </div>
          ))}
          </div>
          {results.length === 0 && <div className={searchStyle.empty}><strong>{loading ? "Loading entries…" : "No results found"}</strong><p>{loading ? "Pages and commands are ready to search." : "Try another word, a #tag, or an :author."}</p></div>}
          {loading && results.length > 0 && <p className={searchStyle.feedback} role="status">Loading published entries…</p>}
          {unavailable && !loading && <p className={searchStyle.feedback}>Some entries couldn’t be loaded. Pages and commands are still available.<button type="button" onClick={() => { loadedAtRef.current = 0; setAttempt((value) => value + 1); }}>Retry</button></p>}
          {help && <p className={searchStyle.feedback}>Search titles and descriptions. Combine words to narrow results. Use #design for a tag, :zimo for an author, or -word to exclude it. Put a phrase in quotation marks to match it together.</p>}
        </div>
        <div className={searchStyle.footer} data-search-footer><span className={searchStyle.keyboardHint}><kbd>↑ ↓</kbd> to browse · <kbd>Enter</kbd> to open</span><span className={searchStyle.touchHint}>Tap a result to open</span><button type="button" aria-expanded={help} onClick={() => setHelp((value) => !value)}>{help ? "Hide search tips" : "Search tips"}</button><span className={searchStyle.footerHint}><kbd>esc</kbd> to close</span></div>
        <span className="sr-only" role="status" aria-live="polite">{query.trim() ? `${results.length} ${results.length === 1 ? "result" : "results"}${loading ? ", loading entries" : ""}` : "Search pages, published entries, tools, and themes."}</span>
      </div>
    </div>
  );
  return container ? createPortal(panel, container) : panel;
}
