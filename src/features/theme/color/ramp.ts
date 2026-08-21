import { maxChroma, toGamut } from "./gamut";
import { parseColorLiteral } from "./format";
import type { ColorLiteral, Gamut, Oklch } from "./types";
import { clamp01, mod360 } from "./types";

export const L_LIGHTEST = 0.985;
export const L_DARKEST = 0.165;

export const defaultEase = (t: number): number =>
  t - (0.1 * Math.sin(2 * Math.PI * t)) / (2 * Math.PI);

export type ChromaDeviation = { readonly delta: number } | { readonly value: number };

export type HueDeviation = { readonly delta: number } | { readonly value: number };

export type RampStop = {
  readonly at: number;
  readonly lightness?: number | undefined;
  readonly chroma?: ChromaDeviation | undefined;
  readonly hue?: HueDeviation | undefined;
  readonly literal?: ColorLiteral | undefined;
};

export type RampSpec = {
  readonly hue: number;
  readonly chroma: number;
  readonly torsion?: number | undefined;
  readonly lightest?: number | undefined;
  readonly darkest?: number | undefined;
  readonly ease?: ((t: number) => number) | undefined;
  readonly envelope?: ((t: number) => number) | undefined;
  readonly stops?: readonly RampStop[] | undefined;
};

export function toneLightness(t: number, ramp: RampSpec): number {
  const ease = ramp.ease ?? defaultEase;
  const lightest = ramp.lightest ?? L_LIGHTEST;
  const darkest = ramp.darkest ?? L_DARKEST;
  return lightest - (lightest - darkest) * ease(clamp01(t));
}

export function inverseToneLightness(l: number, ramp: RampSpec): number {
  let lo = 0;
  let hi = 1;
  for (let step = 0; step < 60; step += 1) {
    const mid = (lo + hi) / 2;
    if (toneLightness(mid, ramp) > l) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function toneRelativeChroma(t: number, ramp: RampSpec): number {
  return clamp01(ramp.chroma * (ramp.envelope?.(t) ?? 1));
}

export function toneHue(t: number, ramp: RampSpec): number {
  return mod360(ramp.hue + (ramp.torsion ?? 0) * (t - 0.5));
}

type Deviation = {
  readonly l?: number | undefined;
  readonly relC?: number | undefined;
  readonly h?: number | undefined;
};

export const shortestArc = (from: number, to: number): number =>
  ((to - from + 540) % 360) - 180;

function liftLiteral(color: Oklch, gamut: Gamut): Deviation {
  return {
    l: color.l,
    relC: color.c / Math.max(maxChroma(color.l, color.h, gamut), 1e-9),
    h: color.h,
  };
}

function resolveStop(stop: RampStop, ramp: RampSpec, gamut: Gamut): Deviation {
  if (stop.literal !== undefined) {
    return liftLiteral(parseColorLiteral(stop.literal), gamut);
  }

  const deviation: { l?: number; relC?: number; h?: number } = {};

  if (stop.lightness !== undefined) {
    deviation.l = stop.lightness;
  }

  if (stop.hue !== undefined) {
    deviation.h =
      "value" in stop.hue
        ? mod360(stop.hue.value)
        : mod360(toneHue(stop.at, ramp) + stop.hue.delta);
  }

  if (stop.chroma !== undefined) {
    deviation.relC =
      "value" in stop.chroma
        ? clamp01(stop.chroma.value)
        : clamp01(toneRelativeChroma(stop.at, ramp) + stop.chroma.delta);
  }

  return deviation;
}

type Bracket = { readonly lo: RampStop; readonly hi: RampStop; readonly f: number };

function locate(stops: readonly RampStop[], u: number): Bracket | null {
  let previous: RampStop | undefined;

  for (const stop of stops) {
    if (previous === undefined) {
      if (u <= stop.at) return { lo: stop, hi: stop, f: 0 };
    } else if (u < stop.at) {
      return { lo: previous, hi: stop, f: (u - previous.at) / (stop.at - previous.at) };
    }
    previous = stop;
  }

  if (previous === undefined) return null;
  return { lo: previous, hi: previous, f: 0 };
}

function blendDeviations(bracket: Bracket, ramp: RampSpec, gamut: Gamut): Deviation {
  const a = resolveStop(bracket.lo, ramp, gamut);
  const b = resolveStop(bracket.hi, ramp, gamut);
  const { f } = bracket;

  const lerp = (x?: number, y?: number): number | undefined =>
    x === undefined ? y : y === undefined ? x : x + (y - x) * f;

  return {
    l: lerp(a.l, b.l),
    relC: lerp(a.relC, b.relC),
    h:
      a.h === undefined
        ? b.h
        : b.h === undefined
          ? a.h
          : mod360(a.h + shortestArc(a.h, b.h) * f),
  };
}

export function sampleRamp(t: number, ramp: RampSpec, gamut: Gamut = "srgb"): Oklch {
  const u = clamp01(t);
  const bracket = locate(ramp.stops ?? [], u);

  if (bracket !== null && bracket.lo.at === u && bracket.lo.literal !== undefined) {
    return toGamut(parseColorLiteral(bracket.lo.literal), gamut);
  }

  const dev = bracket === null ? {} : blendDeviations(bracket, ramp, gamut);

  const l = dev.l ?? toneLightness(u, ramp);
  const h = dev.h ?? toneHue(u, ramp);
  const relC = dev.relC ?? toneRelativeChroma(u, ramp);
  const c = clamp01(relC) * maxChroma(l, h, gamut);

  return toGamut({ l, c, h }, gamut);
}
