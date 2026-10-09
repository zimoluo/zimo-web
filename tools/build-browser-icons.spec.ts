import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve as resolvePath } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { buildBrowserIcons, BROWSER_ICON_ENVIRONMENTS, BROWSER_ICON_SIZES } from "./build-browser-icons";
describe("awaited deterministic browser icons", () => {
  it("completes all fifteen writes before returning, detects stale output and reproduces each byte", async () => {
    const root = mkdtempSync(resolvePath(tmpdir(), "zw-browser-icons-"));
    try {
      mkdirSync(resolvePath(root, "tools/browser-icons"), { recursive: true });
      const source = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="red"/></svg>';
      for (const environment of BROWSER_ICON_ENVIRONMENTS) writeFileSync(resolvePath(root, "tools/browser-icons", `${environment}.svg`), source);
      expect((await buildBrowserIcons(root)).generated).toBe(15);
      for (const environment of BROWSER_ICON_ENVIRONMENTS) for (const size of BROWSER_ICON_SIZES) {
        const file = resolvePath(root, "public/website-favicon", environment, `favicon-${size}x${size}.png`);
        expect(readFileSync(file).byteLength).toBeGreaterThan(0);
        expect((await sharp(file).metadata()).width).toBe(size);
      }
      expect((await buildBrowserIcons(root, true)).differences).toEqual([]);
      writeFileSync(resolvePath(root, "public/website-favicon/production/favicon-32x32.png"), "stale");
      expect((await buildBrowserIcons(root, true)).differences).toEqual(["production/32"]);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
