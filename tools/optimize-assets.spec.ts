import { describe, expect, it } from "vitest";
import { exclusionReason, optimizeSvg, removeVectornatorAttributes, SVG_OPTIMIZATION_EXCLUSIONS } from "./optimize-assets";
describe("deterministic SVG optimization", () => {
  it("removes Linearity metadata with either quote style", () => {
    expect(removeVectornatorAttributes('<svg vectornator:layerName="Layer 1" vectornator:mask=\'yes\' viewBox="0 0 10 10"></svg>')).toBe('<svg viewBox="0 0 10 10"></svg>');
  });
  it("reaches a fixed point and preserves meaningful SVG references", () => {
    const source = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="paint"><stop stop-color="red"/><stop offset="1" stop-color="blue"/></linearGradient></defs><path fill="url(#paint)" d="M0 0 L100 0 L100 100 L0 100Z"/></svg>';
    const first = optimizeSvg(source);
    expect(optimizeSvg(first)).toBe(first);
    expect(first).toContain('url(#'); expect(first).toContain('viewBox="0 0 100 100"');
  });
  it("preserves authored precision and explicit IDs while optimizing defs", () => {
    const source = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><path id="curve" d="M1.234567 2.345678L90.123456 91.234567"/><linearGradient id="paint"><stop stop-color="#FFF"/></linearGradient></defs><use href="#curve" fill="url(#paint)"/></svg>';
    const first = optimizeSvg(source);
    expect(first).toContain('id="curve"'); expect(first).toContain('id="paint"');
    expect(first).toContain('1.234567'); expect(first).toContain('91.234567');
    expect(optimizeSvg(first)).toBe(first);
  });
  it("documents all retained fidelity exclusions and protects generated posters", () => {
    expect(Object.keys(SVG_OPTIMIZATION_EXCLUSIONS)).toHaveLength(5);
    for (const path of Object.keys(SVG_OPTIMIZATION_EXCLUSIONS)) expect(exclusionReason(path)?.length).toBeGreaterThan(20);
    expect(exclusionReason("mark-poster/gallery.svg")).toContain("build-mark-posters");
    expect(exclusionReason("elsewhere.svg")).toBeUndefined();
  });
  it("surfaces invalid SVG content", () => { expect(() => optimizeSvg('<svg><path></svg>')).toThrow(); });
});
