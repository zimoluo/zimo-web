import type { Oklch } from "../color";
import type {
  AlphaBinding,
  Interpolation,
  LayerId,
  LayerVariation,
  LinearDirection,
  Position,
  RadialExtent,
} from "./types";

export type ResolvedStop = {
  readonly at: number;
  readonly color: Oklch;
  readonly alpha?: number | undefined;
  readonly binding?: AlphaBinding | undefined;
};

type ResolvedLayerBase = {
  readonly id: LayerId;
  readonly interpolation?: Interpolation | undefined;
  readonly alpha?: AlphaBinding | undefined;
  readonly variation?: LayerVariation | undefined;
};

export type ResolvedLinearLayer = ResolvedLayerBase & {
  readonly kind: "linear";
  readonly repeating?: boolean | undefined;
  readonly direction: LinearDirection;
  readonly stops: readonly ResolvedStop[];
};

export type ResolvedRadialLayer = ResolvedLayerBase & {
  readonly kind: "radial";
  readonly repeating?: boolean | undefined;
  readonly at: Position;
  readonly extent: RadialExtent;
  readonly stops: readonly ResolvedStop[];
};

export type ResolvedConicLayer = ResolvedLayerBase & {
  readonly kind: "conic";
  readonly repeating?: boolean | undefined;
  readonly from: number;
  readonly at: Position;
  readonly stops: readonly ResolvedStop[];
};

export type ResolvedRawLayer = ResolvedLayerBase & {
  readonly kind: "raw";
  readonly css: string;
};

export type ResolvedLayer =
  | ResolvedLinearLayer
  | ResolvedRadialLayer
  | ResolvedConicLayer
  | ResolvedRawLayer;
