import type { Oklch } from "../theme/color";
import type { ColorRef, NavigationKey } from "../theme/model/types";

export type SceneQuality = "still" | "reduced" | "rich";

export type SceneSurface = "dom" | "r3f";

export type SceneCost = "low" | "medium" | "high";

export type SceneParamValue = number | string | boolean;

export type SceneParams = Readonly<Record<string, SceneParamValue>>;

export type ScenePalette = Readonly<Record<string, Oklch>>;

export type SceneComponentProps<P extends SceneParams = SceneParams> = {
  readonly params: P;
  readonly palette: ScenePalette;
  readonly quality: SceneQuality;
  readonly homeTitle?: boolean;
};

export type SceneParamSpec =
  | {
      readonly kind: "number";
      readonly label: string;
      readonly min: number;
      readonly max: number;
      readonly step?: number;
      readonly default: number;
    }
  | { readonly kind: "boolean"; readonly label: string; readonly default: boolean }
  | {
      readonly kind: "enum";
      readonly label: string;
      readonly options: readonly string[];
      readonly default: string;
    };

export type SceneModule<P extends SceneParams = SceneParams> = {
  readonly id: string;
  readonly name: string;
  readonly surface: SceneSurface;
  readonly params: Readonly<Record<keyof P & string, SceneParamSpec>>;
  readonly palette: Readonly<Record<string, ColorRef>>;
  readonly cost?: SceneCost | undefined;
  readonly themeable?: boolean | undefined;
  readonly only?: readonly NavigationKey[] | undefined;
};

export function defaultsOf<P extends SceneParams>(scene: SceneModule<P>): P {
  const out: Record<string, SceneParamValue> = {};
  for (const [name, spec] of Object.entries(scene.params)) {
    out[name] = spec.default;
  }
  return out as P;
}

export function validateParams<P extends SceneParams>(
  scene: SceneModule<P>,
  input: Readonly<Record<string, unknown>>,
): { readonly params: P; readonly issues: readonly string[] } {
  const issues: string[] = [];
  const out: Record<string, SceneParamValue> = {};

  for (const [name, spec] of Object.entries(scene.params)) {
    const value = input[name];

    if (value === undefined) {
      out[name] = spec.default;
      continue;
    }

    switch (spec.kind) {
      case "number": {
        if (typeof value !== "number" || !Number.isFinite(value)) {
          issues.push(`${scene.id}.${name}: expected a finite number`);
          out[name] = spec.default;
          break;
        }
        const clamped = Math.min(spec.max, Math.max(spec.min, value));
        if (clamped !== value) {
          issues.push(`${scene.id}.${name}: ${value} clamped to ${clamped}`);
        }
        out[name] = clamped;
        break;
      }

      case "boolean": {
        if (typeof value !== "boolean") {
          issues.push(`${scene.id}.${name}: expected a boolean`);
          out[name] = spec.default;
          break;
        }
        out[name] = value;
        break;
      }

      case "enum": {
        if (typeof value !== "string" || !spec.options.includes(value)) {
          issues.push(`${scene.id}.${name}: expected one of ${spec.options.join(", ")}`);
          out[name] = spec.default;
          break;
        }
        out[name] = value;
        break;
      }
    }
  }

  for (const name of Object.keys(input)) {
    if (!(name in scene.params)) issues.push(`${scene.id}.${name}: unknown parameter`);
  }

  return { params: out as P, issues };
}

export type QualityInput = {
  readonly backdrop: "off" | "reduced" | "full";
  readonly reducedMotion: boolean;
  readonly saveData: boolean;
  readonly cost?: SceneCost | undefined;
};

export function resolveQuality(input: QualityInput): SceneQuality | "unmounted" {
  if (input.backdrop === "off") return "unmounted";
  if (input.reducedMotion) return "still";

  const ceiling: SceneQuality =
    input.backdrop === "reduced" || input.saveData ? "reduced" : "rich";

  if (ceiling === "reduced" && input.cost === "high") return "still";

  return ceiling;
}
