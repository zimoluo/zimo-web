import { describe, expect, it } from "vitest";
import { layoutHeader, planHeaderMotion } from "./header-layout";

const widths = [320, 390, 531, 532, 640, 767, 768, 779, 780, 793, 794, 900, 1024, 1175, 1176, 1440, 1800];
const states = widths.flatMap(width => [false, true].flatMap(menu => [false, true].flatMap(expanded => [false, true].map(strip => layoutHeader({ width, menu, expanded, strip, destinations: width < 360 ? 178 : width < 640 ? 210 : 228, command: 420 })))));

describe("header states and transition corridors", () => {
  it("keeps visible controls separated in every target state", () => {
    for (const layout of states) {
      if (layout.command.visible) {
        expect(layout.command.x).toBeGreaterThanOrEqual(0);
        expect(layout.command.width).toBeGreaterThan(76);
        if (layout.windows.visible && layout.command.y === 10) expect(layout.command.x + layout.command.width).toBeCloseTo(layout.windows.x - 16);
        if (layout.nav.visible && layout.command.y === 10) expect(layout.command.x).toBeGreaterThanOrEqual(layout.nav.rect.x + layout.nav.rect.width + 16);
      }
      if (layout.nav.visible && layout.mode === "stacked") expect(layout.command.y).toBeGreaterThan(layout.nav.rect.y + layout.nav.rect.height);
    }
  });
  it("leaves clearance for expanding hover labels in centered rows", () => {
    for (const width of [900, 916, 923, 924, 932, 960, 1024]) {
      const state = layoutHeader({ width, menu: true, expanded: true, strip: true, destinations: 228, command: 146 });
      if (state.nav.labels) {
        expect(state.nav.anchor + 150).toBeLessThanOrEqual(state.windows.x - 16);
        expect(state.nav.anchor - 150).toBeGreaterThanOrEqual(84);
      }
    }
  });
  it("keeps modal chrome hidden and retained preferences independent", () => {
    const modal = layoutHeader({ width: 390, menu: true, expanded: true, strip: true, destinations: 210, command: 146 });
    expect(modal.visible).toBe(false); expect(modal.nav.visible).toBe(false); expect(modal.command.visible).toBe(false);
    const hidden = layoutHeader({ width: 390, menu: false, expanded: false, strip: true, destinations: 210, command: 146 });
    expect(hidden.mode).toBe("substituted"); expect(hidden.command.y).toBe(10);
  });
  it("plans every ordered state pair with exact start and destination geometry", () => {
    for (const from of states) for (const to of states) {
      const plan = planHeaderMotion({ command: from.command, nav: from.nav.rect, headerVisible: from.visible, navVisible: from.nav.visible, windowsVisible: from.windows.visible, sidebarBoundary: from.sidebarBoundary }, to);
      expect(plan.command[0]).toMatchObject({ x: from.command.x, y: from.command.y, width: from.command.width });
      expect(plan.command.at(-1)).toMatchObject({ x: to.command.x, y: to.command.y, width: to.command.width });
      expect(plan.command.every((frame, index) => index === 0 || frame.offset > plan.command[index - 1]!.offset)).toBe(true);
    }
  });
  it("moves search through a clear corridor before crossing rows on sidebar reflow", () => {
    const closed = layoutHeader({ width: 1024, menu: false, expanded: true, strip: true, destinations: 228, command: 146 });
    const open = layoutHeader({ width: 1024, menu: true, expanded: true, strip: true, destinations: 228, command: 146 });
    for (const [from, to] of [[closed, open], [open, closed]] as const) {
      const plan = planHeaderMotion({ command: from.command, nav: from.nav.rect, headerVisible: true, navVisible: true, windowsVisible: from.windows.visible, sidebarBoundary: from.sidebarBoundary }, to);
      expect(plan.command).toHaveLength(4);
      const first = plan.command[1]!, second = plan.command[2]!;
      expect(first.x).toBeGreaterThanOrEqual(Math.max(from.nav.rect.x + from.nav.rect.width, to.nav.rect.x + to.nav.rect.width) + 16);
      expect(first.x + first.width).toBeLessThanOrEqual(Math.min(from.sidebarBoundary, to.sidebarBoundary));
      expect(second.x).toBe(first.x); expect(second.width).toBe(first.width);
      expect(first.y).toBe(from.command.y); expect(second.y).toBe(to.command.y);
    }
  });
  it("coordinates mobile handover instead of raising search through visible destinations", () => {
    const expanded = layoutHeader({ width: 390, menu: false, expanded: true, strip: true, destinations: 210, command: 146 });
    const hidden = layoutHeader({ width: 390, menu: false, expanded: false, strip: true, destinations: 210, command: 146 });
    const closing = planHeaderMotion({ command: expanded.command, nav: expanded.nav.rect, headerVisible: true, navVisible: true, windowsVisible: false, sidebarBoundary: expanded.sidebarBoundary }, hidden);
    expect(closing.command[1]).toMatchObject({ y: 68, offset: .27 });
    expect(planHeaderMotion({ command: hidden.command, nav: hidden.nav.rect, headerVisible: true, navVisible: false, windowsVisible: false, sidebarBoundary: hidden.sidebarBoundary }, expanded).navEnterDelay).toBe(180);
  });
});
