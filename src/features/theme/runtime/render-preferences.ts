import { cookies } from "next/headers";
import { themeIds } from "../registry";
import { DEFAULT_THEME_ID } from "../store";
import { RENDER_COOKIE } from "./SchemeHost";
import type { Scheme } from "../model/types";

export type RenderPreferences = {
  readonly theme: string;
  readonly scheme: Scheme;
  readonly serif: boolean;
  readonly tableOfContents: boolean;
  readonly navigation: "hidden" | "pinned" | "auto";
};

const isKnownTheme = (id: string): boolean =>
  (themeIds as readonly string[]).includes(id);

export function parseRenderCookie(raw: string | undefined): RenderPreferences {
  const fallback: RenderPreferences = { theme: DEFAULT_THEME_ID, scheme: "light", serif: true, tableOfContents: true, navigation: "auto" };
  if (raw === undefined || raw.length === 0) return fallback;

  const fields = new Map<string, string>();
  for (const pair of raw.split("&")) {
    const index = pair.indexOf("=");
    if (index === -1) continue;
    try { fields.set(pair.slice(0, index), decodeURIComponent(pair.slice(index + 1))); } catch { continue; }
  }

  const theme = fields.get("t");
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
  const store = await cookies();
  return parseRenderCookie(store.get(RENDER_COOKIE)?.value);
}
