import type { ResolvedMark, ResolvedMarkGradient } from "../model/resolved-theme";

export const MARK_VIEWBOX = 100;

export const MARK_GRADIENT_ID_PREFIX = "zw-mark-gradient";

export const gradientId = (region: number): string => `${MARK_GRADIENT_ID_PREFIX}-${region}`;

export type MarkRegionPath = { readonly region: number; readonly d: string };

const CENTER = MARK_VIEWBOX / 2;
const RADIUS = MARK_VIEWBOX / 2;

const polar = (angleDegrees: number): readonly [number, number] => {
  const radians = ((angleDegrees - 90) * Math.PI) / 180;
  return [
    Number((CENTER + RADIUS * Math.cos(radians)).toFixed(4)),
    Number((CENTER + RADIUS * Math.sin(radians)).toFixed(4)),
  ];
};

const wedge = (fromDegrees: number, toDegrees: number): string => {
  const [x1, y1] = polar(fromDegrees);
  const [x2, y2] = polar(toDegrees);
  const large = toDegrees - fromDegrees > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${x2} ${y2} Z`;
};

export function regionPaths(mark: ResolvedMark): readonly MarkRegionPath[] {
  if (mark.mode !== "split") {
    return [{ region: 0, d: "" }];
  }
  return [
    { region: 0, d: wedge(0, 120) },
    { region: 1, d: wedge(120, 240) },
    { region: 2, d: wedge(240, 360) },
  ];
}

export function gradientVector(gradient: ResolvedMarkGradient): {
  readonly x1: string;
  readonly y1: string;
  readonly x2: string;
  readonly y2: string;
} {
  const radians = ((gradient.angle - 90) * Math.PI) / 180;
  const dx = Math.cos(radians) / 2;
  const dy = Math.sin(radians) / 2;
  const pct = (value: number): string => `${Number((value * 100).toFixed(4))}%`;

  return {
    x1: pct(0.5 - dx),
    y1: pct(0.5 - dy),
    x2: pct(0.5 + dx),
    y2: pct(0.5 + dy),
  };
}

export function stopVariable(region: number, index: number): string {
  return `--zw-mark-${region}-${index}`;
}

export function gradientsFor(mark: ResolvedMark): readonly ResolvedMarkGradient[] {
  if (mark.gradients.length === 0) return [];
  if (mark.mode !== "split") return [mark.gradients[0] as ResolvedMarkGradient];

  const first = mark.gradients[0] as ResolvedMarkGradient;
  return [
    mark.gradients[0] ?? first,
    mark.gradients[1] ?? first,
    mark.gradients[2] ?? first,
  ];
}
