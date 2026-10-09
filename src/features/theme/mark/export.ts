import { scenePosterSvg, exportBackdropMarkSvg } from "../../backdrop";
import { layerToCss } from "../compile/gradient";
import { formatHex, parseColorLiteral, parseColorLiteralAlpha } from "../color";
import type { ResolvedMark } from "../model/resolved-theme";
import {
  MARK_VIEWBOX,
  MARK_OUTLINE,
  gradientId,
  gradientVector,
  gradientsFor,
  regionPaths,
} from "./geometry";

export function exportMarkSvg(mark: ResolvedMark): string {
  if (mark.mode === "backdrop") { const image = (mark.backdrop ?? []).map((layer) => layerToCss(layer, "all", "page")).join(", ").replace(/oklch\([^()]*\)/g, (literal) => { const alpha = parseColorLiteralAlpha(literal); return formatHex(parseColorLiteral(literal), "srgb") + (alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, "0") : ""); }).replaceAll("var(--zw-surface-page-alpha)", "1"); return exportBackdropMarkSvg({ image: image || "none", base: "none", stroke: formatHex(mark.stroke), outline: MARK_OUTLINE }); }
  if (mark.mode === "scene") return scenePosterSvg({ sceneId: mark.sceneId ?? "gallery", palette: { base: formatHex(mark.scenePalette?.base ?? mark.gradients[0]?.stops[0]?.color ?? mark.stroke), highlight: formatHex(mark.scenePalette?.highlight ?? mark.gradients[0]?.stops[1]?.color ?? mark.stroke), accent: formatHex(mark.scenePalette?.accent ?? mark.gradients[1]?.stops[0]?.color ?? mark.stroke), stroke: formatHex(mark.stroke) } });
  const gradients = gradientsFor(mark);

  const defs = gradients
    .map((gradient, region) => {
      const { x1, y1, x2, y2 } = gradientVector(gradient);
      const stops = gradient.stops
        .map(
          (stop) =>
            `      <stop offset="${stop.offset}" stop-color="${formatHex(stop.color, "srgb")}" />`,
        )
        .join("\n");
      return (
        `    <linearGradient id="${gradientId(region)}" x1="${x1}" y1="${y1}" ` +
        `x2="${x2}" y2="${y2}">\n${stops}\n    </linearGradient>`
      );
    })
    .join("\n");

  const body: string[] = [];
  if (mark.mode !== "outline") {
    for (const { region, d } of regionPaths(mark)) body.push(`  <path d="${d}" fill="${gradients.length ? `url(#${gradientId(region)})` : formatHex(mark.stroke, "srgb")}" />`);
  }
  body.push(`  <path d="${MARK_OUTLINE}" fill="none" stroke="${formatHex(mark.stroke, "srgb")}" stroke-width="64" stroke-linecap="round" stroke-linejoin="round" />`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_VIEWBOX} ${MARK_VIEWBOX}" width="${MARK_VIEWBOX}" height="${MARK_VIEWBOX}">
${defs.length > 0 ? `  <defs>\n${defs}\n  </defs>\n` : ""}${body.join("\n")}
</svg>
`;
}
