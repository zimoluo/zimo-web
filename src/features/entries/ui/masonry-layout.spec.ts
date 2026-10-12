import { describe, expect, it } from "vitest";
import { planMasonry } from "./masonry-layout";
describe("album layout geometry", () => {
  it("retains native desktop widths, chronological columns, and exact gutters", () => {
    const plan = planMasonry(1184, 288, 8, [1, .75, 2, 1, .5]);
    expect(plan.columns).toBe(4);
    expect(plan.positions.map(position => position.left)).toEqual([4, 300, 596, 892, 4]);
    expect(plan.positions[4]?.top).toBe(296);
    expect(plan.height).toBe(880);
  });
  it("centers native phone tiles and fits a narrower container", () => {
    expect(planMasonry(352, 168, 8, [1, 1]).positions.map(position => [position.left, position.width])).toEqual([[4, 168], [180, 168]]);
    expect(planMasonry(120, 168, 8, [1]).positions[0]).toEqual({ left: 0, top: 0, width: 120, height: 120 });
  });
  it("retains fractional heights instead of rounding away the crop", () => {
    const plan = planMasonry(176, 168, 8, [.7, 1]);
    expect(plan.positions[1]?.top).toBe(168 / .7 + 8);
    expect(plan.height).toBe(168 / .7 + 8 + 168 + 8);
  });
  it("handles empty content and invalid optional ratios without invalid paint", () => {
    expect(planMasonry(352, 168, 8, []).height).toBe(0);
    for (const ratio of [0, Number.NaN, Number.POSITIVE_INFINITY]) expect(planMasonry(176, 168, 8, [ratio]).positions[0]?.height).toBe(168);
  });
});
