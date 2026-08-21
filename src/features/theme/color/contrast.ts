import { oklchToOklab, oklchToLinearSrgb } from "./oklab";
import { linearToGamma } from "./srgb";
import type { Oklch } from "./types";

const bound = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export function relativeLuminance(color: Oklch): number {
  const { r, g, b } = oklchToLinearSrgb(color);
  return 0.2126 * bound(r) + 0.7152 * bound(g) + 0.0722 * bound(b);
}

export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

const MAIN_TRC = 2.4;
const R_CO = 0.2126729;
const G_CO = 0.7151522;
const B_CO = 0.0721750;
const NORM_BG = 0.56;
const NORM_TXT = 0.57;
const REV_TXT = 0.62;
const REV_BG = 0.65;
const BLK_THRS = 0.022;
const BLK_CLMP = 1.414;
const SCALE_BOW = 1.14;
const SCALE_WOB = 1.14;
const LO_BOW_OFFSET = 0.027;
const LO_WOB_OFFSET = 0.027;
const DELTA_Y_MIN = 0.0005;
const LO_CLIP = 0.1;

function apcaLuminance(color: Oklch): number {
  const { r, g, b } = oklchToLinearSrgb(color);
  const encoded = (value: number): number => bound(linearToGamma(bound(value))) ** MAIN_TRC;
  const y = R_CO * encoded(r) + G_CO * encoded(g) + B_CO * encoded(b);
  return y < BLK_THRS ? y + (BLK_THRS - y) ** BLK_CLMP : y;
}

export function apcaLc(text: Oklch, background: Oklch): number {
  const yText = apcaLuminance(text);
  const yBackground = apcaLuminance(background);

  if (Math.abs(yBackground - yText) < DELTA_Y_MIN) return 0;

  if (yBackground > yText) {
    const sapc = (yBackground ** NORM_BG - yText ** NORM_TXT) * SCALE_BOW;
    return sapc < LO_CLIP ? 0 : (sapc - LO_BOW_OFFSET) * 100;
  }

  const sapc = (yBackground ** REV_BG - yText ** REV_TXT) * SCALE_WOB;
  return sapc > -LO_CLIP ? 0 : (sapc + LO_WOB_OFFSET) * 100;
}

export function deltaEOk(a: Oklch, b: Oklch): number {
  const labA = oklchToOklab(a);
  const labB = oklchToOklab(b);
  return Math.hypot(labA.l - labB.l, labA.a - labB.a, labA.b - labB.b);
}
