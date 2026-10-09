import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import sharp from "sharp";
import { getTheme, themeIds } from "../src/features/theme/registry";
import { resolve, schemesOf } from "../src/features/theme/model/resolve";
import { formatHex } from "../src/features/theme/color";
import { scenePosterSvg } from "../src/features/backdrop/mark/motif";

const ROOT = resolvePath(import.meta.dirname, "..");
const output = resolvePath(ROOT, "public/mark-poster");
const check = process.argv.includes("--check");
const report: { readonly themeId: string; readonly sceneId: string; readonly svg: string; readonly webp: string }[] = [];
const matches = (path: string, bytes: Buffer): boolean => { try { return readFileSync(path).equals(bytes); } catch { return false; } };
let failures = 0;
if (!check) mkdirSync(output, { recursive: true });
for (const themeId of themeIds) {
  const source = getTheme(themeId);
  if (source.mark?.mode !== "scene") continue;
  const scheme = schemesOf(source)[0] ?? "light";
  const theme = resolve(source, scheme);
  const sceneId = theme.mark.sceneId ?? "gallery";
  const scene = theme.backdrop?.scenes.find((candidate) => candidate.id === sceneId);
  const palette = scene?.palette ?? {};
  const svg = Buffer.from(scenePosterSvg({ sceneId, palette: {
    base: formatHex(palette.base ?? theme.roles.brand, "srgb"),
    highlight: formatHex(palette.highlight ?? theme.roles.panel, "srgb"),
    accent: formatHex(palette.accent ?? theme.roles.accent, "srgb"),
    stroke: formatHex(theme.mark.stroke, "srgb"),
  } }));
  const webp = await sharp(svg).resize(256, 256).webp({ lossless: true, effort: 6 }).toBuffer();
  const svgPath = resolvePath(output, `${themeId}.svg`);
  const webpPath = resolvePath(output, `${themeId}.webp`);
  if (check) { if (!matches(svgPath, svg) || !matches(webpPath, webp)) { failures++; console.error(`Poster differs: ${themeId}`); } }
  else { writeFileSync(svgPath, svg); writeFileSync(webpPath, webp); }
  report.push({ themeId, sceneId, svg: `mark-poster/${themeId}.svg`, webp: `mark-poster/${themeId}.webp` });
}
const manifest = Buffer.from(JSON.stringify({ version: 1, renderer: "authored-svg-first-frame", posters: report }, null, 2) + "\n");
const manifestPath = resolvePath(output, "manifest.json");
if (check) { if (!matches(manifestPath, manifest)) failures++; }
else writeFileSync(manifestPath, manifest);
console.log(`${check ? "Verified" : "Generated"} ${report.length} scene-mark posters (${failures} differences)`);
if (failures > 0) process.exitCode = 1;
