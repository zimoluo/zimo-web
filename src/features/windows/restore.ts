import { z } from "zod";
import type { Rect, Size } from "./geometry/types";
import type { PersistedWindow, WindowDefinitionId, WindowId } from "./model";

export type RestoreIssue = {
  readonly index: number;
  readonly reason: string;
  readonly definitionId?: string | undefined;
};

export type RestoreResult = {
  readonly windows: readonly PersistedWindow[];
  readonly issues: readonly RestoreIssue[];
};

const rectSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
});

export const persistedWindowSchema = z.object({
  id: z.string().min(1),
  definitionId: z.string().min(1),
  props: z.record(z.string(), z.unknown()),
  rect: rectSchema,
  group: z.number().int().min(0).max(9),
});

export const persistedLayoutSchema = z.object({
  viewport: z.object({
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
  }),
  windows: z.array(z.unknown()),
});

export type PersistedLayout = {
  readonly viewport: Size;
  readonly windows: readonly unknown[];
};

export type DefinitionLookup = {
  readonly known: (id: string) => boolean;
  readonly validateProps: (
    id: string,
    props: unknown,
  ) => Readonly<Record<string, unknown>> | null;
};

export function scaleRect(rect: Rect, from: Size, to: Size): Rect {
  const scaleX = to.width / from.width;
  const scaleY = to.height / from.height;

  return {
    x: Math.round(rect.x * scaleX),
    y: Math.round(rect.y * scaleY),
    width: Math.round(rect.width * scaleX),
    height: Math.round(rect.height * scaleY),
  };
}

export function restoreLayout(
  raw: unknown,
  viewport: Size,
  definitions: DefinitionLookup,
): RestoreResult {
  const parsed = persistedLayoutSchema.safeParse(raw);

  if (!parsed.success) {
    return { windows: [], issues: [{ index: -1, reason: "layout is not readable" }] };
  }

  const layout = parsed.data as PersistedLayout;
  const windows: PersistedWindow[] = [];
  const issues: RestoreIssue[] = [];
  const seen = new Set<string>();

  layout.windows.forEach((candidate, index) => {
    const shape = persistedWindowSchema.safeParse(candidate);

    if (!shape.success) {
      issues.push({ index, reason: "window is not readable" });
      return;
    }

    const window = shape.data;

    if (seen.has(window.id)) {
      issues.push({
        index,
        reason: "duplicate id",
        definitionId: window.definitionId,
      });
      return;
    }

    if (!definitions.known(window.definitionId)) {
      issues.push({
        index,
        reason: "unknown definition",
        definitionId: window.definitionId,
      });
      return;
    }

    const props = definitions.validateProps(window.definitionId, window.props);

    if (props === null) {
      issues.push({
        index,
        reason: "props failed validation",
        definitionId: window.definitionId,
      });
      return;
    }

    seen.add(window.id);

    windows.push({
      id: window.id as WindowId,
      definitionId: window.definitionId as WindowDefinitionId,
      props,
      rect: scaleRect(window.rect, layout.viewport, viewport),
      group: window.group,
    });
  });

  return { windows, issues };
}

export const describeIssues = (issues: readonly RestoreIssue[]): string =>
  issues
    .map((issue) =>
      issue.definitionId === undefined
        ? `#${issue.index}: ${issue.reason}`
        : `#${issue.index} (${issue.definitionId}): ${issue.reason}`,
    )
    .join("; ");
