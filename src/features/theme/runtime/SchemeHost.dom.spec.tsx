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
  it("keeps a fixed light appearance while retaining the user's dark preference", async () => {
    useTheme.getState().selectBuiltIn("gold");
    useTheme.getState().setSchemePreference("dark");
    const container = document.createElement("div"); document.body.append(container); const root = createRoot(container);
    await act(async () => root.render(<SchemeHost />));
    expect(document.documentElement.dataset.scheme).toBe("light");
    expect(document.cookie).toContain("s=dark");
    expect(useTheme.getState().schemePreference).toBe("dark");
    await act(async () => useTheme.getState().selectBuiltIn("whiteout"));
    expect(document.documentElement.dataset.scheme).toBe("dark");
    expect(document.cookie).toContain("s=dark");
    await act(async () => root.unmount()); container.remove();
    useTheme.getState().setSchemePreference("system");
  });
  it("refreshes the rendered scheme when the active profile is reviewed", async () => {
    useTheme.getState().addProfile(getTheme("gold"));
    const index = useTheme.getState().profiles.length - 1;
    useTheme.getState().selectProfile(index);
    useTheme.getState().setSchemePreference("dark");
    const container = document.createElement("div"); document.body.append(container); const root = createRoot(container);
    await act(async () => root.render(<SchemeHost />));
    expect(document.documentElement.dataset.scheme).toBe("light");
    await act(async () => useTheme.getState().replaceProfile(index, { ...getTheme("whiteout"), schemes: { kind:"dual", light:defaultLightRoles, darkReviewed:true } }));
    expect(document.documentElement.dataset.scheme).toBe("dark");
    expect(document.cookie).toContain("s=dark");
    await act(async () => root.unmount()); container.remove();
    useTheme.getState().selectBuiltIn("home"); useTheme.getState().setSchemePreference("system");
  });
  it("uses the fixed appearance in the DOM and keeps the requested scheme in the cookie", async () => {
    const source = { ...getTheme("velvet"), schemes: { kind: "single" as const, scheme: "dark" as const, roles: defaultLightRoles } };
    useTheme.getState().addProfile(source);
    useTheme.getState().selectProfile(useTheme.getState().profiles.length - 1);
    useTheme.getState().setSchemePreference("light");
    const container = document.createElement("div"); document.body.append(container); const root = createRoot(container);
    await act(async () => root.render(<SchemeHost />));
    expect(document.documentElement.dataset.scheme).toBe("dark");
    expect(document.cookie).toContain("s=light");
    await act(async () => root.unmount()); container.remove();
    useTheme.getState().selectBuiltIn("home"); useTheme.getState().setSchemePreference("system");
  });
});
