import { themeIds } from "../registry";
import { DEFAULT_THEME_ID } from "../store";

export const DARK_OVERRIDE_ID = "plain-black";

export const kebab = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const known = (id: string): boolean => (themeIds as readonly string[]).includes(id);

export function resolveThemeId(key: unknown): string | null {
  if (typeof key !== "string" || key === "custom") return null;
  if (known(key)) return key;

  const kebabbed = kebab(key);
  return known(kebabbed) ? kebabbed : null;
}

export type Selection =
  | { readonly kind: "builtIn"; readonly id: string }
  | { readonly kind: "profile"; readonly index: number };

export type SelectionInput = {
  readonly key: unknown;
  readonly darkOverride: boolean;
  readonly profileIndex: number;
  readonly profileCount: number;
};

export function resolveSelection(input: SelectionInput): Selection {
  if (input.darkOverride) return { kind: "builtIn", id: DARK_OVERRIDE_ID };

  const isProfile = input.key === "custom" || typeof input.key === "object";

  if (isProfile) {
    return input.profileIndex >= 0 && input.profileIndex < input.profileCount
      ? { kind: "profile", index: input.profileIndex }
      : { kind: "builtIn", id: DEFAULT_THEME_ID };
  }

  return { kind: "builtIn", id: resolveThemeId(input.key) ?? DEFAULT_THEME_ID };
}
