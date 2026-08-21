export type ColorTriplet = readonly [number, number, number];

export type LegacyGradientStop = {
  readonly color: ColorTriplet;
  readonly opacity: number;
  readonly isWidgetOpacity?: boolean;
  readonly at: number;
};

export type LegacyGradientType =
  | "linear-gradient"
  | "radial-gradient"
  | "repeating-linear-gradient"
  | "repeating-radial-gradient"
  | "conic-gradient"
  | "repeating-conic-gradient"
  | "custom";

export type LegacyColorInterpolation = {
  readonly colorSpace: string;
  readonly hueInterpolationMethod?: string;
};

export type LegacyColorGradient = {
  readonly type: LegacyGradientType;
  readonly stops?: readonly LegacyGradientStop[];
  readonly disabled?: boolean;
  readonly colorInterpolation?: LegacyColorInterpolation;
  readonly angle?: number;
  readonly linearGradientKeyword?: boolean;
  readonly linearHorizontalOrientation?: "left" | "right";
  readonly linearVerticalOrientation?: "top" | "bottom";
  readonly posX?: number;
  readonly posY?: number;
  readonly sizeX?: number;
  readonly sizeY?: number;
  readonly isCircle?: boolean;
  readonly sizeKeyword?:
    | "closest-side"
    | "closest-corner"
    | "farthest-side"
    | "farthest-corner";
  readonly content?: string;
};

export type LegacyRawColorPaletteData = {
  readonly primary: ColorTriplet;
  readonly saturated: ColorTriplet;
  readonly pastel: ColorTriplet;
  readonly light: ColorTriplet;
  readonly page: readonly LegacyColorGradient[];
  readonly pageMinimal?: readonly LegacyColorGradient[];
  readonly widget: readonly LegacyColorGradient[];
};

export type LegacyFaviconGradientStop = { readonly color: string; readonly offset: number };

export type LegacyFaviconGradientStopsConfig = {
  readonly stops: readonly LegacyFaviconGradientStop[];
  readonly angle?: number;
};

export type LegacyFaviconConfig = {
  readonly mode: "backdrop" | "outline" | "separate" | "overall" | "custom";
  readonly outline?: string;
  readonly customKey?: "gallery" | "gallery3D";
  readonly gradient?: readonly LegacyFaviconGradientStopsConfig[];
  readonly backdropGradient?: readonly LegacyColorGradient[];
  readonly backdropProhibitSVG?: boolean;
};

export type LegacyThemeMiscOptions = { readonly readingBlur?: number };

export type LegacyThemeDataConfig = {
  readonly formatVersion?: 1;
  readonly palette: LegacyRawColorPaletteData;
  readonly siteThemeColor: string;
  readonly favicon: LegacyFaviconConfig;
  readonly animatedBackgroundKey?: string | readonly string[];
  readonly misc?: LegacyThemeMiscOptions;
};

export const LEGACY_ACCENTS = ["primary", "saturated", "pastel", "light"] as const;

export type LegacyAccent = (typeof LEGACY_ACCENTS)[number];
