import { formatHex } from "../color";
import type { ResolvedMark } from "../model/resolved-theme";
import {
  MARK_VIEWBOX,
  gradientId,
  gradientVector,
  gradientsFor,
  regionPaths,
} from "./geometry";

export function exportMarkSvg(mark: ResolvedMark): string {
  const gradients = gradientsFor(mark);
  const strokeWidth = MARK_VIEWBOX * 0.08;
  const center = MARK_VIEWBOX / 2;

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

  if (mark.mode === "split") {
    for (const { region, d } of regionPaths(mark)) {
      body.push(`  <path d="${d}" fill="url(#${gradientId(region)})" />`);
    }
  } else if (mark.mode === "outline") {
    body.push(
      `  <circle cx="${center}" cy="${center}" r="${center - strokeWidth / 2}" ` +
        `fill="none" stroke="${formatHex(mark.stroke, "srgb")}" stroke-width="${strokeWidth}" />`,
    );
  } else if (gradients.length > 0) {
    body.push(`  <circle cx="${center}" cy="${center}" r="${center}" fill="url(#${gradientId(0)})" />`);
  } else {
    body.push(
      `  <circle cx="${center}" cy="${center}" r="${center}" fill="${formatHex(mark.stroke, "srgb")}" />`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_VIEWBOX} ${MARK_VIEWBOX}" width="${MARK_VIEWBOX}" height="${MARK_VIEWBOX}">
${defs.length > 0 ? `  <defs>\n${defs}\n  </defs>\n` : ""}${body.join("\n")}
</svg>
`;
}
