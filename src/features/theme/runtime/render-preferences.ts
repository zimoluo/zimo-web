import { cookies, headers } from "next/headers";
import { themeIds } from "../registry";
import { DEFAULT_ROUTE_THEMES } from "../store";
import { RENDER_COOKIE } from "./SchemeHost";
import type { NavigationKey, Scheme } from "../model/types";

export type RenderPreferences = {
  readonly theme: string;
  readonly scheme: Scheme;
  readonly serif: boolean;
  readonly tableOfContents: boolean;
  readonly navigation: "hidden" | "pinned" | "auto";
};

const isKnownTheme = (id: string): boolean =>
  (themeIds as readonly string[]).includes(id);

export function parseRenderCookie(raw: string | undefined, route: NavigationKey = "home"): RenderPreferences {
  const fallback: RenderPreferences = { theme: DEFAULT_ROUTE_THEMES[route], scheme: "light", serif: true, tableOfContents: true, navigation: "auto" };
  if (raw === undefined || raw.length === 0) return fallback;

  const fields = new Map<string, string>();
  for (const pair of raw.split("&")) {
    const index = pair.indexOf("=");
    if (index === -1) continue;
    try { fields.set(pair.slice(0, index), decodeURIComponent(pair.slice(index + 1))); } catch { continue; }
  }

  const theme = fields.get("r") === route || route === "home" && !fields.has("r") ? fields.get("t") : fields.get(`t.${route}`);
  const scheme = fields.get("s");

  return {
    theme: theme !== undefined && isKnownTheme(theme) ? theme : fallback.theme,
    scheme: scheme === "dark" ? "dark" : "light",
    serif: fields.get("f") !== "sans",
    tableOfContents: fields.get("toc") !== "0",
    navigation: fields.get("nav") === "hidden" ? "hidden" : fields.get("nav") === "pinned" ? "pinned" : "auto",
  };
}

export async function readRenderPreferences(): Promise<RenderPreferences> {
  const [store, request] = await Promise.all([cookies(), headers()]);
  const key = request.get("x-zimo-route");
  const route = key !== null && Object.hasOwn(DEFAULT_ROUTE_THEMES, key) ? key as NavigationKey : "home";
  return parseRenderCookie(store.get(RENDER_COOKIE)?.value, route);
}
