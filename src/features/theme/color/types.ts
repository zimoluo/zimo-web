export type Oklch = { readonly l: number; readonly c: number; readonly h: number };

export type Oklab = { readonly l: number; readonly a: number; readonly b: number };

export type LinearSrgb = { readonly r: number; readonly g: number; readonly b: number };

export type Gamut = "srgb" | "display-p3";

export type CssColor = string & { readonly __brand: "CssColor" };

export type ColorLiteral = string & { readonly __brand: "ColorLiteral" };

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export const mod360 = (x: number): number => ((x % 360) + 360) % 360;
