import { describe, expect, it } from "vitest";
import { advanceScrollIntent, initialScrollIntent } from "./scroll-intent";

describe("flexible navigation intent", () => {
  it("reveals on upward movement far from the page top", () => {
    const down = advanceScrollIntent(initialScrollIntent(), 600);
    expect(down.expanded).toBe(false);
    expect(advanceScrollIntent(down, 580).expanded).toBe(true);
  });
  it("accumulates slow movement but ignores a small direction reversal", () => {
    let state = { ...initialScrollIntent(100), expanded: true };
    for (const y of [101, 103, 105, 107]) state = advanceScrollIntent(state, y);
    expect(state.expanded).toBe(true);
    state = advanceScrollIntent(state, 108);
    expect(state.expanded).toBe(false);
    for (const y of [107, 106, 105]) state = advanceScrollIntent(state, y);
    expect(state.expanded).toBe(false);
    expect(advanceScrollIntent(state, 100).expanded).toBe(true);
  });
  it("resets near the top including elastic overscroll", () => {
    expect(advanceScrollIntent(initialScrollIntent(500), -12)).toEqual(initialScrollIntent());
    expect(advanceScrollIntent(initialScrollIntent(100), 23).expanded).toBe(true);
  });
  it("does not lose subpixel displacement before a meaningful movement", () => {
    const state = initialScrollIntent(100);
    expect(advanceScrollIntent(state, 100.1)).toBe(state);
    expect(advanceScrollIntent(state, 91.8).expanded).toBe(true);
  });
});
