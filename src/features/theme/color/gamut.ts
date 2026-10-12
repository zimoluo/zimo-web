import { oklchToLinearSrgb } from "./oklab";
import type { Gamut, LinearSrgb, Oklch } from "./types";

const EPS = 1e-5;
const SEARCH_CEILING = 0.5;

export function isInGamut(rgb: LinearSrgb, tolerance = 1e-6): boolean {
  return (
    rgb.r >= -tolerance &&
    rgb.r <= 1 + tolerance &&
    rgb.g >= -tolerance &&
    rgb.g <= 1 + tolerance &&
    rgb.b >= -tolerance &&
    rgb.b <= 1 + tolerance
  );
}

export function toLinear(color: Oklch, gamut: Gamut = "srgb"): LinearSrgb {
  if (gamut === "display-p3") {
    throw new Error("display-p3 is not implemented; see T2 §3");
  }
  return oklchToLinearSrgb(color);
}

export const MAX_CHROMA_CACHE_ENTRIES = 8192;

const cache = new Map<string, number>();

function computeMaxChroma(l: number, h: number, gamut: Gamut): number {
  let lo = 0;
  let hi = SEARCH_CEILING;
  while (hi - lo > EPS) {
    const mid = (lo + hi) / 2;
    if (isInGamut(toLinear({ l, c: mid, h }, gamut))) lo = mid;
    else hi = mid;
  }
  return lo;
}

export function maxChroma(l: number, h: number, gamut: Gamut = "srgb"): number {
  const key = `${gamut}:${l}:${h}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const value = computeMaxChroma(l, h, gamut);
  if (cache.size >= MAX_CHROMA_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
  cache.set(key, value);
  return value;
}

export function clearMaxChromaCache(): void {
  cache.clear();
}

export function maxChromaCacheSize(): number {
  return cache.size;
}

export function toGamut(color: Oklch, gamut: Gamut = "srgb"): Oklch {
  const cap = maxChroma(color.l, color.h, gamut);
  return color.c <= cap ? color : { l: color.l, c: cap, h: color.h };
}
