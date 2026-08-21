import { AppError } from "../../../lib/errors";
import type { LinearSrgb } from "./types";

export const linearToGamma = (x: number): number =>
  x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;

export const gammaToLinear = (x: number): number =>
  x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;

const HEX_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const expand = (hex: string): string => {
  const body = hex.slice(1);
  if (body.length === 3 || body.length === 4) {
    return body
      .split("")
      .map((character) => character + character)
      .join("");
  }
  return body;
};

export function hexToLinearSrgb(hex: string): LinearSrgb {
  if (!HEX_PATTERN.test(hex)) {
    throw new AppError("invalid-request", `Not a hex color: ${hex}`, hex);
  }
  const body = expand(hex);
  const channel = (index: number): number =>
    gammaToLinear(Number.parseInt(body.slice(index, index + 2), 16) / 255);
  return { r: channel(0), g: channel(2), b: channel(4) };
}

export function hexAlpha(hex: string): number {
  if (!HEX_PATTERN.test(hex)) {
    throw new AppError("invalid-request", `Not a hex color: ${hex}`, hex);
  }
  const body = expand(hex);
  return body.length === 8 ? Number.parseInt(body.slice(6, 8), 16) / 255 : 1;
}

export function linearSrgbToHex({ r, g, b }: LinearSrgb): string {
  const channel = (value: number): string => {
    const gamma = linearToGamma(value);
    const bounded = gamma < 0 ? 0 : gamma > 1 ? 1 : gamma;
    return Math.round(bounded * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}
