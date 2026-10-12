import { describe, expect, it } from "vitest";
import { commandPlacement } from "./command-geometry";

describe("command surface placement", () => {
  it("shares the bar's top and right edge while gaining room for results", () => {
    const placed = commandPlacement({ x: 0, y: 0, width: 1440, height: 900 }, { x: 1050, y: 10, width: 238, height: 52 });
    expect(placed.x + placed.width).toBe(1288); expect(placed.y).toBe(10); expect(placed.fieldHeight).toBe(52);
  });
  it("retains a full-width mobile field rather than introducing another horizontal inset", () => {
    const placed = commandPlacement({ x: 0, y: 0, width: 390, height: 844 }, { x: 10, y: 68, width: 370, height: 48 });
    expect(placed).toEqual({ x: 10, y: 68, width: 370, maxHeight: 768, fieldHeight: 48 });
  });
  it("fits fallback and anchored fields inside a shifted visual viewport", () => {
    for (const anchor of [null, { x: 10, y: 68, width: 370, height: 48 }]) {
      const placed = commandPlacement({ x: 80, y: 120, width: 300, height: 260 }, anchor);
      expect(placed.x).toBeGreaterThanOrEqual(90); expect(placed.x + placed.width).toBeLessThanOrEqual(370);
      expect(placed.y).toBeGreaterThanOrEqual(128); expect(placed.y + placed.maxHeight).toBeLessThanOrEqual(372);
    }
  });
});
