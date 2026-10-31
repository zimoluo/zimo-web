import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ThemeChoices } from "./ThemeChoices";
import { useTheme } from "../../theme";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe("theme chooser hydration", () => {
  it("uses one snapshot for its selection and caption while a later boundary hydrates", async () => {
    const previous = useTheme.getState();
    const host = document.createElement("div");
    host.innerHTML = renderToString(<ThemeChoices />);
    expect(host.textContent).toContain("Whiteout");
    document.body.append(host);
    useTheme.getState().selectBuiltIn("halloween");
    const errors: unknown[] = [];
    const root = hydrateRoot(host, <ThemeChoices />, { onRecoverableError: error => errors.push(error) });
    try {
      await act(async () => { await new Promise(done => setTimeout(done, 0)); });
      expect(errors).toEqual([]);
      expect(host.querySelector("strong")?.textContent).toBe("Halloween");
      expect(host.querySelector('[aria-checked="true"]')?.getAttribute("aria-label")).toBe("Use Halloween theme");
    } finally {
      await act(async () => root.unmount());
      host.remove();
      useTheme.setState(previous, true);
    }
  });
});
