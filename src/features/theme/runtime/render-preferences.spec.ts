import { describe, expect, it } from "vitest";
import { parseRenderCookie } from "./render-preferences";
import { themeIds } from "../registry";
import { DEFAULT_THEME_ID } from "../store";

describe("parseRenderCookie", () => {
  it("reads a theme and scheme pair", () => {
    expect(parseRenderCookie("t=velvet&s=dark")).toEqual({
      theme: "velvet",
      scheme: "dark", serif: true, tableOfContents: true, navigation: "auto",
    });
  });

  it("defaults to the fallback theme in the light scheme when absent", () => {
    for (const raw of [undefined, ""]) {
      expect(parseRenderCookie(raw)).toEqual({
        theme: DEFAULT_THEME_ID,
        scheme: "light", serif: true, tableOfContents: true, navigation: "auto",
      });
    }
  });

  it("rejects a theme id that is not in the registry, so markup cannot be poisoned", () => {
    expect(parseRenderCookie("t=../../etc/passwd&s=dark").theme).toBe(DEFAULT_THEME_ID);
    expect(parseRenderCookie('t="><script>&s=dark').theme).toBe(DEFAULT_THEME_ID);
    expect(parseRenderCookie("t=not-a-theme").theme).toBe(DEFAULT_THEME_ID);
  });

  it("treats any scheme other than dark as light", () => {
    expect(parseRenderCookie("t=velvet&s=purple").scheme).toBe("light");
    expect(parseRenderCookie("t=velvet").scheme).toBe("light");
  });

  it("tolerates malformed pairs", () => {
    expect(parseRenderCookie("garbage").theme).toBe(DEFAULT_THEME_ID);
    expect(parseRenderCookie("&&=&").theme).toBe(DEFAULT_THEME_ID);
    expect(parseRenderCookie("t=").theme).toBe(DEFAULT_THEME_ID);
  });

  it("reads the server-visible reading and navigation preferences", () => {
    expect(parseRenderCookie("t=velvet&s=dark&f=serif&toc=1&nav=auto")).toEqual({
      theme: "velvet",
      scheme: "dark", serif: true, tableOfContents: true, navigation: "auto",
    });
  });

  it("validates reading and navigation fields and malformed percent encoding", () => {
    expect(parseRenderCookie("t=%XX&s=dark&f=sans&toc=0&nav=hidden")).toEqual({ theme: DEFAULT_THEME_ID, scheme: "dark", serif: false, tableOfContents: false, navigation: "hidden" });
    expect(parseRenderCookie("t=home&nav=pinned").navigation).toBe("pinned");
    expect(parseRenderCookie("t=home&f=bad&toc=bad&nav=bad")).toMatchObject({ serif: true, tableOfContents: true, navigation: "auto" });
  });

  it("accepts every registry theme", () => {
    for (const id of themeIds) {
      expect(parseRenderCookie(`t=${id}&s=light`).theme, id).toBe(id);
    }
  });

  it("D5 C10: the cookie it parses stays inside 64 bytes", () => {
    const longest = [...themeIds].sort((a, b) => b.length - a.length)[0] ?? "";
    const value = `zw.render=t=${longest}&s=dark&f=serif&toc=1&nav=pinned`;
    expect(value.length).toBeLessThanOrEqual(64);
  });
});
