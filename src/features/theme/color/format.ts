import { AppError } from "../../../lib/errors";
import { linearSrgbToOklch } from "./oklab";
import { toGamut, toLinear } from "./gamut";
import { hexAlpha, hexToLinearSrgb, linearSrgbToHex } from "./srgb";
import type { ColorLiteral, CssColor, Gamut, Oklch } from "./types";
import { mod360 } from "./types";

const round = (value: number, digits: number): number => Number(value.toFixed(digits));

export function formatOklch({ l, c, h }: Oklch): CssColor {
  return `oklch(${round(l, 5)} ${round(c, 5)} ${round(h, 2)})` as CssColor;
}

export function formatOklchWithAlpha(color: Oklch, alpha: number): CssColor {
  if (alpha >= 1) return formatOklch(color);
  const { l, c, h } = color;
  return `oklch(${round(l, 5)} ${round(c, 5)} ${round(h, 2)} / ${round(
    alpha < 0 ? 0 : alpha,
    4,
  )})` as CssColor;
}

export function formatHex(color: Oklch, gamut?: Gamut): string {
  const mapped = gamut === undefined ? color : toGamut(color, gamut);
  return linearSrgbToHex(toLinear(mapped, gamut ?? "srgb"));
}

const OKLCH_PREFIX = "oklch(";

const parseNumber = (raw: string, what: string, literal: string): number => {
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) {
    throw new AppError("invalid-request", `Unparseable ${what} in color: ${literal}`, literal);
  }
  return value;
};

const parseLightness = (raw: string, literal: string): number =>
  raw.endsWith("%")
    ? parseNumber(raw, "lightness", literal) / 100
    : parseNumber(raw, "lightness", literal);

const parseChroma = (raw: string, literal: string): number =>
  raw.endsWith("%")
    ? (parseNumber(raw, "chroma", literal) / 100) * 0.4
    : parseNumber(raw, "chroma", literal);

const parseHue = (raw: string, literal: string): number =>
  mod360(parseNumber(raw.replace(/deg$/i, ""), "hue", literal));

const splitOnce = (text: string, separator: string): readonly [string, string | null] => {
  const index = text.indexOf(separator);
  return index === -1 ? [text, null] : [text.slice(0, index), text.slice(index + 1)];
};

const oklchParts = (
  literal: string,
): { readonly components: readonly [string, string, string]; readonly alpha: string | null } => {
  const lower = literal.toLowerCase();
  if (!lower.startsWith(OKLCH_PREFIX) || !lower.endsWith(")")) {
    throw new AppError("invalid-request", `Unrecognized color literal: ${literal}`, literal);
  }
  const inner = literal.slice(OKLCH_PREFIX.length, -1);
  const [colorText, alpha] = splitOnce(inner, "/");
  const tokens = colorText.trim().split(/\s+/).filter((token) => token.length > 0);
  if (tokens.length !== 3) {
    throw new AppError("invalid-request", `Unrecognized color literal: ${literal}`, literal);
  }
  return { components: tokens as [string, string, string], alpha };
};

export function parseColorLiteral(literal: ColorLiteral | string): Oklch {
  const trimmed = literal.trim();

  if (trimmed.startsWith("#")) {
    return linearSrgbToOklch(hexToLinearSrgb(trimmed));
  }

  const [rawL, rawC, rawH] = oklchParts(trimmed).components;
  return {
    l: parseLightness(rawL, trimmed),
    c: parseChroma(rawC, trimmed),
    h: parseHue(rawH, trimmed),
  };
}

export function parseColorLiteralAlpha(literal: ColorLiteral | string): number {
  const trimmed = literal.trim();
  parseColorLiteral(trimmed);

  if (trimmed.startsWith("#")) return hexAlpha(trimmed);

  const { alpha } = oklchParts(trimmed);
  if (alpha === null) return 1;
  const raw = alpha.trim();
  const value = raw.endsWith("%")
    ? parseNumber(raw, "alpha", trimmed) / 100
    : parseNumber(raw, "alpha", trimmed);
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
