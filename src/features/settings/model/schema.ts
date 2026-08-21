import { z } from "zod";
import type { Settings } from "./settings";

export const settingsSchema = z.object({
  version: z.literal(3),
  revision: z.number().int().min(0),

  reading: z.object({
    blur: z.number().min(0).max(200),
    serif: z.boolean(),
    tableOfContents: z.boolean(),
  }),

  motion: z.object({
    backdrop: z.enum(["off", "reduced", "full"]),
    gestures: z.boolean(),
    transitions: z.enum(["auto", "reduced"]),
  }),

  notifications: z.object({
    style: z.enum(["off", "banner", "inline"]),
    limit: z.number().int().min(1).max(10),
  }),

  comments: z.object({ enabled: z.boolean() }),

  sound: z.object({ enabled: z.boolean() }),

  navigation: z.object({
    bar: z.enum(["hidden", "pinned", "auto"]),
    contextStrip: z.boolean(),
  }),

  windows: z.object({
    limit: z.number().int().min(1).max(32),
    snapping: z.boolean(),
    snapToViewport: z.boolean(),
    resizeBehavior: z.enum(["corner", "center", "adaptive"]),
    restoreOnLoad: z.boolean(),
  }),

  studio: z.object({
    expandWindow: z.boolean(),
    extendedStopRange: z.boolean(),
    showInterpolation: z.boolean(),
    showLookupPanel: z.boolean(),
  }),

  sync: z.object({ enabled: z.boolean() }),

  experiments: z.record(z.string(), z.boolean()),
});

export const parseSettings = (input: unknown): Settings =>
  settingsSchema.parse(input) as Settings;

export const safeParseSettings = (input: unknown): Settings | null => {
  const result = settingsSchema.safeParse(input);
  return result.success ? (result.data as Settings) : null;
};
