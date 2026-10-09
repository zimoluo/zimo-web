import { z } from "zod";
import { themeSourceSchema, loadThemeSource } from "./schema";
import { themeIds } from "../registry";
import type { NavigationKey, ThemeSource } from "./types";

export const activeThemeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("builtIn"), id: z.string().refine((id) => (themeIds as readonly string[]).includes(id)) }),
  z.object({ kind: z.literal("profile"), index: z.number().int().nonnegative() }),
]);
export const themePreferencesSchema = z.object({
  revision: z.number().int().nonnegative().default(0),
  active: activeThemeSchema,
  scheme: z.enum(["light", "dark"]),
  schemePreference: z.enum(["light", "dark", "system"]),
  profiles: z.array(themeSourceSchema.transform((value) => value as unknown as ThemeSource)).max(200),
  seasonal: z.boolean(),
  shuffle: z.boolean().default(false),
  byRoute: z.partialRecord(z.enum(["home", "blog", "photos", "projects", "about", "management", "design"]), activeThemeSchema).default({}),
}).refine((value) => [value.active, ...Object.values(value.byRoute)].every((active) => active === undefined || active.kind !== "profile" || active.index < value.profiles.length), { message: "A selected profile does not exist" });
export type ThemePreferences = z.infer<typeof themePreferencesSchema>;
export const routeKey = (pathname: string): NavigationKey => {
  const section = pathname.split("/")[1];
  if (section === "album" || section === "photos") return "photos";
  if (section === "blog" || section === "projects" || section === "about" || section === "management") return section;
  if (section === "design" || section === "notebook" || section === "theme-maker") return "design";
  return "home";
};

export function migrateThemePreferences(input: unknown): ThemePreferences {
  const legacy = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const profiles: ThemeSource[] = [];
  const importProfile = (input: unknown): number | null => {
    const result = loadThemeSource(input);
    if (!result.ok) return null;
    const existing = profiles.findIndex((profile) => JSON.stringify(profile) === JSON.stringify(result.theme));
    if (existing >= 0) return existing;
    profiles.push(result.theme); return profiles.length - 1;
  };
  const importedIndices = Array.isArray(legacy.customThemeData) ? legacy.customThemeData.map(importProfile) : [];
  const byRoute: ThemePreferences["byRoute"] = {};
  const canonicalId = (value: string) => ({ birthdayGeneric: "birthday-generic", defaultEditor: "default-editor", gallery3D: "gallery3-d", pixelland: "pixelland", plainBlack: "plain-black", plainDark: "plain-dark", plainGray: "plain-gray", plainLight: "plain-light", springField: "spring-field" } as Readonly<Record<string, string>>)[value] ?? value;
  if (typeof legacy.pageTheme === "object" && legacy.pageTheme !== null) {
    for (const [key, value] of Object.entries(legacy.pageTheme)) {
      const route = routeKey(`/${key === "home" ? "" : key}`);
      if (value === "custom" && typeof legacy.customThemeIndex === "number") { const index = importedIndices[legacy.customThemeIndex]; if (index !== undefined && index !== null) byRoute[route] = { kind: "profile", index }; }
      else if (typeof value === "string" && (themeIds as readonly string[]).includes(canonicalId(value))) byRoute[route] = { kind: "builtIn", id: canonicalId(value) };
      else if (typeof value === "object" && value !== null) { const index = importProfile(value); if (index !== null) byRoute[route] = { kind: "profile", index }; }
    }
  }
  return { revision: 0, active: byRoute.home ?? { kind: "builtIn", id: "home" }, scheme: "light", schemePreference: legacy.darkModeThemesOverride === true ? "dark" : "system", profiles, seasonal: legacy.disableSpecialTheme !== true, shuffle: legacy.randomizeThemeOnEveryVisit === true, byRoute };
}
