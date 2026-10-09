import { describe, expect, it, vi } from "vitest";
import { RendererLease } from "./renderer-lease";
function setup() { const events = { activate: vi.fn(), capture: vi.fn(), frame: vi.fn() }; return { events, lease: new RendererLease(events) }; }
describe("document renderer lease", () => {
  it("warms the page once, captures at handoff and gives the Studio its live renderer", () => {
    const { lease, events } = setup(); lease.mount("page", false); expect(lease.current).toBe("page");
    lease.painted("page", "page-first"); expect(lease.wantsFrame("page")).toBe(false);
    lease.mount("studio", true); expect(lease.current).toBe("page"); expect(lease.wantsFrame("page")).toBe(true);
    lease.painted("page", "page-last"); expect(lease.current).toBe("studio");
    lease.painted("studio", "studio-first"); expect(lease.current).toBe("studio");
    lease.painted("studio", "ignored-frame"); expect(events.frame).toHaveBeenCalledTimes(3);
    lease.remove("studio"); expect(lease.current).toBe("page"); expect(lease.wantsFrame("page")).toBe(false);
  });
  it("warms secondary windows, then transfers focus without allocating a second renderer", () => {
    const { lease } = setup(); lease.mount("page", false); lease.mount("first", true); lease.mount("second", true);
    lease.painted("page", "page"); expect(lease.current).toBe("first");
    lease.painted("first", "first"); expect(lease.current).toBe("second");
    lease.painted("second", "second"); lease.focus("first"); expect(lease.current).toBe("second");
    lease.painted("second", "second-last"); expect(lease.current).toBe("first");
    lease.remove("first"); expect(lease.current).toBe("second");
    lease.remove("second"); expect(lease.current).toBe("page");
    lease.remove("page"); expect(lease.current).toBeNull(); expect(lease.size).toBe(0);
  });
  it("captures newly structured scenes once and ignores stale renderer frames", () => {
    const { lease, events } = setup(); lease.mount("page", false); lease.painted("page", "old");
    lease.refresh("page"); expect(lease.wantsFrame("page")).toBe(true);
    lease.painted("other", "stale"); expect(events.frame).toHaveBeenCalledTimes(1);
    lease.painted("page", "new"); expect(lease.wantsFrame("page")).toBe(false);
  });
});
