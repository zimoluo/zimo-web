import type { Oklch } from "../color";
import type { ResolvedLayer } from "./resolved";
import type {
  MarkMode,
  NavigationKey,
  RoleName,
  Scheme,
  SurfaceRole,
  SurfaceVariation,
} from "./types";

export type ResolvedLens = {
  readonly blur: number;
  readonly saturate: number;
  readonly brightness: number;
};

export type ResolvedReading = {
  readonly blur: number;
  readonly serif: boolean;
};

export type ResolvedSurface = {
  readonly layers: readonly ResolvedLayer[];
  readonly alpha: number;
  readonly lens: ResolvedLens;
  readonly variation?: SurfaceVariation | undefined;
};

export type ResolvedScene = {
  readonly id: string;
  readonly params: Readonly<Record<string, number | string | boolean>>;
  readonly palette: Readonly<Record<string, Oklch>>;
  readonly only?: readonly NavigationKey[] | undefined;
};

export type ResolvedBackdrop = { readonly scenes: readonly ResolvedScene[] };

export type ResolvedMarkStop = { readonly offset: number; readonly color: Oklch };

export type ResolvedMarkGradient = {
  readonly angle: number;
  readonly stops: readonly ResolvedMarkStop[];
};

export type ResolvedMark = {
  readonly mode: MarkMode;
  readonly stroke: Oklch;
  readonly gradients: readonly ResolvedMarkGradient[];
  readonly backdrop?: readonly ResolvedLayer[] | undefined;
  readonly sceneId?: string | undefined;
};

export type ResolvedTheme = {
  readonly id: string;
  readonly name: string;
  readonly scheme: Scheme;
  readonly roles: Readonly<Record<RoleName, Oklch>>;
  readonly tone: (t: number) => Oklch;
  readonly surfaces: Readonly<Record<SurfaceRole, ResolvedSurface>>;
  readonly backdrop: ResolvedBackdrop | null;
  readonly mark: ResolvedMark;
  readonly reading: ResolvedReading;
};

export type ResolveWarning = { readonly code: string; readonly message: string };

export type ResolveResult = {
  readonly theme: ResolvedTheme;
  readonly warnings: readonly ResolveWarning[];
};
