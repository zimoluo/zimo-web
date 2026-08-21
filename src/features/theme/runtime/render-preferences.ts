import { cookies } from "next/headers";
import { themeIds } from "../registry";
import { DEFAULT_THEME_ID } from "../store";
import { RENDER_COOKIE } from "./SchemeHost";
import type { Scheme } from "../model/types";

export type RenderPreferences = {
  readonly theme: string;
  readonly scheme: Scheme;
};

const isKnownTheme = (id: string): boolean =>
  (themeIds as readonly string[]).includes(id);

export function parseRenderCookie(raw: string | undefined): RenderPreferences {
  const fallback: RenderPreferences = { theme: DEFAULT_THEME_ID, scheme: "light" };
  if (raw === undefined || raw.length === 0) return fallback;

  const fields = new Map<string, string>();
  for (const pair of raw.split("&")) {
    const index = pair.indexOf("=");
    if (index === -1) continue;
    fields.set(pair.slice(0, index), decodeURIComponent(pair.slice(index + 1)));
  }

  const theme = fields.get("t");
  const scheme = fields.get("s");

  return {
    theme: theme !== undefined && isKnownTheme(theme) ? theme : fallback.theme,
    scheme: scheme === "dark" ? "dark" : "light",
  };
}

export async function readRenderPreferences(): Promise<RenderPreferences> {
  const store = await cookies();
  return parseRenderCookie(store.get(RENDER_COOKIE)?.value);
}
