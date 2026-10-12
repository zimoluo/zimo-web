import { describe, expect, it } from "vitest";
import { structuralPaintRanges } from "./svg-structural-paints";

describe("SVG coverage paint ownership", () => {
  it("protects masks and clipping shapes while retaining visible artwork", () => {
    const svg = '<svg><path fill="red"/><mask fill="white"><path fill="gray"/></mask><clipPath><path fill="black"/></clipPath><path fill="blue"/></svg>';
    expect(structuralPaintRanges(svg).map(([start, end]) => svg.slice(start, end)))
      .toEqual(['<mask fill="white"><path fill="gray"/></mask>', '<clipPath><path fill="black"/></clipPath>']);
  });
  it("keeps quoted tag delimiters and nested containers intact", () => {
    const svg = '<mask data-label="a > b"><clipPath><path fill="white"/></clipPath></mask>';
    const ranges = structuralPaintRanges(svg);
    expect(ranges.some(([start, end]) => start === 0 && end === svg.length)).toBe(true);
    expect(ranges).toHaveLength(2);
  });
  it("protects self-closing structural paint attributes", () => {
    const svg = '<svg><mask fill="white"/><path fill="red"/></svg>';
    expect(structuralPaintRanges(svg).map(([start, end]) => svg.slice(start, end))).toEqual(['<mask fill="white"/>']);
  });
  it("rejects broken structural markup rather than silently binding its paint", () => {
    expect(() => structuralPaintRanges('<mask><path fill="white"/>')).toThrow();
    expect(() => structuralPaintRanges('</clipPath>')).toThrow();
  });
});
