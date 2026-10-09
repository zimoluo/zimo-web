import type { ResolvedMark, ResolvedMarkGradient } from "../model/resolved-theme";

export const MARK_VIEWBOX = 1024;

export const MARK_GRADIENT_ID_PREFIX = "zw-mark-gradient";

export const gradientId = (region: number): string => `${MARK_GRADIENT_ID_PREFIX}-${region}`;

export type MarkRegionPath = { readonly region: number; readonly d: string };

export const MARK_OUTLINE = "M260.875 921.071C123.592 836.607 32.011 685.015 32.011 512.004C32.011 507.708 32.2239 503.457 32.3354 499.189C96.3983 468.123 168.24 450.535 244.192 450.203C336.607 449.8 423.147 474.988 497.151 519.06C360.067 602.288 267.013 750.654 260.875 921.071ZM260.875 921.071C270.309 659.167 484.918 449.172 749.371 448.018C837.516 447.635 920.277 470.589 991.962 510.941C991.972 511.297 992 511.648 992 512.004C992 777.096 777.096 992 512.004 992C419.936 992 333.935 966.016 260.875 921.071ZM32 511.992C32 246.9 246.9 32 511.992 32C777.084 32 991.981 246.9 991.981 511.992C991.981 777.084 777.086 991.981 511.992 991.981C246.898 991.981 32 777.086 32 511.992Z";
const REGIONS: readonly MarkRegionPath[] = [
  { region: 0, d: "M34 512C34 248.008 248.008 34 512 34C775.992 34 990 248.008 990 512C990 775.992 775.992 990 512 990C248.008 990 34 775.992 34 512Z" },
  { region: 1, d: "M748.412 449.005C485.086 450.152 271.392 658.997 262 919.466C334.747 964.159 420.382 990 512.056 990C776.018 990 990 776.279 990 512.639C990 512.285 989.972 511.937 989.972 511.582C918.589 471.453 836.181 448.623 748.412 449.005Z" },
  { region: 2, d: "M244.75 451.005C169.309 451.335 97.9533 468.853 34.3228 499.796C34.2112 504.046 34 508.281 34 512.559C34 684.882 124.962 835.871 261.32 920C267.416 750.261 359.842 602.484 496 519.588C422.496 475.69 336.54 450.604 244.75 451.005Z" },
];
export function regionPaths(mark: ResolvedMark): readonly MarkRegionPath[] { return mark.mode === "split" ? REGIONS : REGIONS.slice(0, 1); }

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
