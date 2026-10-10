import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeHost } from "./ThemeHost";
import { useTheme } from "../store";
import { getTheme } from "../registry";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => { document.body.style.color = ""; useTheme.getState().selectBuiltIn("home"); useTheme.getState().setSchemePreference("system"); });
describe("live theme foreground", () => {
  it("updates the document foreground with the profile and clears stale overrides on built-in selection", async () => {
    useTheme.getState().addProfile(getTheme("memories"));
    useTheme.getState().selectProfile(useTheme.getState().profiles.length - 1);
    useTheme.getState().setSchemePreference("dark");
    const host = document.createElement("div"); document.body.append(host); const root = createRoot(host);
    await act(async () => { root.render(<ThemeHost />); });
    await act(async () => { await new Promise((done) => requestAnimationFrame(done)); });
    expect(document.body.style.color).toBe("rgb(247, 244, 255)");
    expect(document.documentElement.style.getPropertyValue("--zw-role-text")).not.toBe("");
    await act(async () => { useTheme.getState().selectBuiltIn("whiteout"); useTheme.getState().setSchemePreference("light"); });
    expect(document.documentElement.style.getPropertyValue("--zw-role-text")).toBe("");
    expect(document.body.style.color).not.toBe("rgb(247, 244, 255)");
    await act(async () => root.unmount()); host.remove();
  });
});
