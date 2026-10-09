import { describe, expect, it } from "vitest";
import { rewrite, scopedId } from "./randomize-svg-ids";

describe("SVG asset id scope", () => {
  it("preserves HTML ids and their accessibility relationships", () => {
    const source = '<input aria-controls="results" /><div id="results" role="listbox" />';
    expect(rewrite("CommandPalette.tsx", source)).toBe(source);
  });
  it("scopes SVG definitions and references deterministically and idempotently", () => {
    const source = '<svg><defs><linearGradient id="paint" /></defs><path fill="url(#paint)"/><use href="#paint" /></svg>';
    const result = rewrite("mark.tsx", source);
    expect(result).toContain(`id="${scopedId("mark.tsx", "paint")}"`);
    expect(result).toContain(`url(#${scopedId("mark.tsx", "paint")})`);
    expect(result).toContain(`href="#${scopedId("mark.tsx", "paint")}"`);
    expect(rewrite("mark.tsx", result)).toBe(result);
    expect(scopedId("other.tsx", "paint")).not.toBe(scopedId("mark.tsx", "paint"));
  });
});
