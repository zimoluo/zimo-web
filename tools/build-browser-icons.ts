import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

export const BROWSER_ICON_SIZES = [32, 96, 1024, 192, 180] as const;
export const BROWSER_ICON_ENVIRONMENTS = ["production", "preview", "development"] as const;
export type BrowserIconReport = { readonly generated: number; readonly differences: readonly string[] };

export async function buildBrowserIcons(root: string, check = false): Promise<BrowserIconReport> {
  const differences: string[] = [];
  const writes = BROWSER_ICON_ENVIRONMENTS.flatMap((environment) => BROWSER_ICON_SIZES.map(async (size) => {
    const source = resolvePath(root, "tools/browser-icons", `${environment}.svg`);
    const directory = resolvePath(root, "public/website-favicon", environment);
    const output = resolvePath(directory, `favicon-${size}x${size}.png`);
    const bytes = await sharp(readFileSync(source)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
    if (check) {
      try { if (!readFileSync(output).equals(bytes)) differences.push(`${environment}/${size}`); }
      catch { differences.push(`${environment}/${size}`); }
    } else { mkdirSync(directory, { recursive: true }); writeFileSync(output, bytes); }
  }));
  await Promise.all(writes);
  return { generated: writes.length, differences: differences.sort() };
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes("--check");
  const report = await buildBrowserIcons(resolvePath(import.meta.dirname, ".."), check);
  console.log(`${check ? "Verified" : "Generated"} ${report.generated} browser icons; ${report.differences.length} differences`);
  if (report.differences.length > 0) { console.error(report.differences.join("\n")); process.exitCode = 1; }
}
