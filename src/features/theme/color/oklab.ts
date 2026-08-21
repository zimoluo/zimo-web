import type { LinearSrgb, Oklab, Oklch } from "./types";
import { mod360 } from "./types";

const DEG = Math.PI / 180;

export function oklabToLinearSrgb({ l, a, b }: Oklab): LinearSrgb {
  const lCbrt = l + 0.3963377774 * a + 0.2158037573 * b;
  const mCbrt = l - 0.1055613458 * a - 0.0638541728 * b;
  const sCbrt = l - 0.0894841775 * a - 1.2914855480 * b;
  const lLong = lCbrt ** 3;
  const mLong = mCbrt ** 3;
  const sLong = sCbrt ** 3;
  return {
    r: +4.0767416621 * lLong - 3.3077115913 * mLong + 0.2309699292 * sLong,
    g: -1.2684380046 * lLong + 2.6097574011 * mLong - 0.3413193965 * sLong,
    b: -0.0041960863 * lLong - 0.7034186147 * mLong + 1.7076147010 * sLong,
  };
}

export function linearSrgbToOklab({ r, g, b }: LinearSrgb): Oklab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    l: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  };
}

export function oklchToOklab({ l, c, h }: Oklch): Oklab {
  const radians = h * DEG;
  return { l, a: c * Math.cos(radians), b: c * Math.sin(radians) };
}

export function oklabToOklch({ l, a, b }: Oklab): Oklch {
  const c = Math.hypot(a, b);
  return { l, c, h: c === 0 ? 0 : mod360((Math.atan2(b, a) / DEG)) };
}

export function oklchToLinearSrgb(color: Oklch): LinearSrgb {
  return oklabToLinearSrgb(oklchToOklab(color));
}

export function linearSrgbToOklch(rgb: LinearSrgb): Oklch {
  return oklabToOklch(linearSrgbToOklab(rgb));
}
