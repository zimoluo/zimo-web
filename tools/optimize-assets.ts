import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { relative, resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";
import { optimize } from "svgo";


export const SVG_OPTIMIZATION_EXCLUSIONS: Readonly<Record<string, string>> = {
  "theme/animated-background/birthday19/colors.svg": "Authored anniversary colors composition; preserve the supplied curve precision.",
  "theme/animated-background/birthday19/nineteen.svg": "Authored anniversary numerals; preserve the supplied curve precision.",
  "theme/picker/birthday19.svg": "Picker miniature of the same anniversary artwork; keep its geometry aligned with the scene.",
  "theme/picker/gallery3D.svg": "Authored miniature of the 3D mark; preserve its supplied projected shapes.",
  "theme/animated-background/grass/bg.svg": "Dense authored grass artwork; preserve the supplied path geometry until visual comparison.",
};
export function exclusionReason(publicRelativePath: string): string | undefined {
  if (publicRelativePath.startsWith("mark-poster/")) return "Deterministic generated first frames are owned by build-mark-posters.ts.";
  return SVG_OPTIMIZATION_EXCLUSIONS[publicRelativePath];
}
export function removeVectornatorAttributes(svg: string): string {
  return svg.replace(/\s+vectornator:[^\s=]+=(?:"[^"]*"|'[^']*')/g, "");
}
export function optimizeSvg(source: string): string {
  let current = removeVectornatorAttributes(source);
  for (let attempt = 0; attempt < 8; attempt++) {

    const next = optimize(current, { multipass: true, plugins: [{ name: "preset-default", params: { overrides: {
      cleanupIds: false, convertPathData: false, convertTransform: false,
      cleanupNumericValues: false, sortDefsChildren: false,
    } } }] }).data;
    if (next === current) return next;
    current = next;
  }
  throw new Error("SVG optimization failed to reach a stable result after eight passes");
}
function collect(directory: string): readonly string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolvePath(directory, entry.name);
    return entry.isDirectory() ? collect(path) : entry.name.endsWith(".svg") ? [path] : [];
  }).sort();
}
export function optimizeAssets(root: string, check = false): {
  readonly scanned: number; readonly changed: readonly string[]; readonly excluded: readonly string[]; readonly bytesSaved: number;
} {
  const publicDirectory = resolvePath(root, "public");
  const changed: string[] = []; const excluded: string[] = []; let bytesSaved = 0;
  const files = collect(publicDirectory);
  for (const file of files) {
    const path = relative(publicDirectory, file).replaceAll("\\", "/");
    if (exclusionReason(path) !== undefined) { excluded.push(path); continue; }
    const before = readFileSync(file, "utf8");
    let after: string;
    try { after = optimizeSvg(before); } catch (cause) { throw new Error(`Failed to optimize public/${path}`, { cause }); }
    if (before === after) continue;
    changed.push(path); bytesSaved += Buffer.byteLength(before) - Buffer.byteLength(after);
    if (!check) writeFileSync(file, after);
  }
  return { scanned: files.length, changed, excluded, bytesSaved };
}
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes("--check");
  const report = optimizeAssets(resolvePath(import.meta.dirname, ".."), check);
  console.log(`SVG assets: ${report.scanned} scanned, ${report.excluded.length} explained exclusions, ${report.changed.length} ${check ? "stale" : "updated"}, ${report.bytesSaved} bytes saved`);
  if (check && report.changed.length > 0) { console.error(report.changed.join("\n")); process.exitCode = 1; }
}
