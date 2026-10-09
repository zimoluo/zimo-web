import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SchemeHost, writeRenderCookie } from "./SchemeHost";
import { getTheme } from "../registry";
import { defaultLightRoles } from "../model/defaults";
import { useTheme } from "../store";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => { document.cookie = "zw.render=; path=/; max-age=0"; });
describe("server-visible render preference synchronization", () => {
  it("merges independent theme and reading cookie writers", () => {
    writeRenderCookie({ f: "sans", toc: "0", nav: "pinned" });
    writeRenderCookie({ t: "velvet", s: "dark" });
    const value = document.cookie.split("; ").find((entry) => entry.startsWith("zw.render="))?.slice(10);
    expect(new URLSearchParams(value).get("f")).toBe("sans");
    expect(new URLSearchParams(value).get("t")).toBe("velvet");
  });
  it("uses a single-scheme theme's actual scheme in the DOM and cookie", async () => {
    const source = { ...getTheme("velvet"), schemes: { kind: "single" as const, scheme: "dark" as const, roles: defaultLightRoles } };
    useTheme.getState().addProfile(source);
    useTheme.getState().selectProfile(useTheme.getState().profiles.length - 1);
    useTheme.getState().setSchemePreference("light");
    const container = document.createElement("div"); document.body.append(container); const root = createRoot(container);
    await act(async () => root.render(<SchemeHost />));
    expect(document.documentElement.dataset.scheme).toBe("dark");
    expect(document.cookie).toContain("s=dark");
    await act(async () => root.unmount()); container.remove();
    useTheme.getState().selectBuiltIn("home"); useTheme.getState().setSchemePreference("system");
  });
});
