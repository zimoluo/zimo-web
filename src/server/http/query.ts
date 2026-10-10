import { AppError } from "../../lib/errors";
import { parseSlug } from "../../features/entries/model/ids";
import { isIsoInstant } from "../../lib/datetime";
import type { EntrySummary } from "../../features/entries/model/types";

export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 200;

export function parseLimit(raw: string | null): number {
  if (raw === null || raw === "") return DEFAULT_LIMIT;

  if (!/^\d+$/.test(raw)) {
    throw new AppError("invalid-request", "limit must be a positive integer", {
      field: "limit",
    });
  }

  const value = Number(raw);
  if (value < 1 || value > MAX_LIMIT) {
    throw new AppError(
      "invalid-request",
      `limit must be between 1 and ${MAX_LIMIT}`,
      { field: "limit" },
    );
  }

  return value;
}

export type Cursor = { readonly publishedAt: string; readonly slug: string };

export const formatCursor = (summary: EntrySummary): string =>
  `${summary.publishedAt}|${summary.slug}`;

export function parseCursor(raw: string | null): Cursor | null {
  if (raw === null || raw === "") return null;

  const separator = raw.indexOf("|");
  if (separator === -1) {
    throw new AppError("invalid-request", "cursor must be publishedAt|slug", {
      field: "cursor",
    });
  }

  const publishedAt = raw.slice(0, separator);
  const slug = raw.slice(separator + 1);

  if (!isIsoInstant(publishedAt) || parseSlug(slug) === null) {
    throw new AppError("invalid-request", "cursor must be publishedAt|slug", {
      field: "cursor",
    });
  }

  return { publishedAt, slug };
}

const afterCursor = (summary: EntrySummary, cursor: Cursor): boolean =>
  summary.publishedAt < cursor.publishedAt ||
  (summary.publishedAt === cursor.publishedAt && summary.slug > cursor.slug);

export type Page<T> = {
  readonly items: readonly T[];
  readonly nextCursor?: string;
};

export function paginate(
  entries: readonly EntrySummary[],
  limit: number,
  cursor: Cursor | null,
): Page<EntrySummary> {
  const start = cursor === null ? entries : entries.filter((entry) => afterCursor(entry, cursor));
  const items = start.slice(0, limit);
  const last = items[items.length - 1];

  return start.length > items.length && last !== undefined
    ? { items, nextCursor: formatCursor(last) }
    : { items };
}

export const SUMMARY_FIELDS = [
  "section",
  "slug",
  "title",
  "description",
  "publishedAt",
  "updatedAt",
  "unlisted",
  "tags",
  "authors",
  "cover",
  "displayCover",
  "display",
] as const;

export type SummaryField = (typeof SUMMARY_FIELDS)[number];

const REQUIRED_FIELDS: readonly SummaryField[] = ["section", "slug"];

export function parseFields(raw: string | null): readonly SummaryField[] | null {
  if (raw === null || raw === "") return null;

  const requested = raw
    .split(",")
    .map((field) => field.trim())
    .filter((field) => field.length > 0);

  if (requested.length === 0) return null;

  const unknown = requested.filter(
    (field) => !(SUMMARY_FIELDS as readonly string[]).includes(field),
  );

  if (unknown.length > 0) {
    throw new AppError(
      "invalid-request",
      `unknown field${unknown.length === 1 ? "" : "s"}: ${unknown.join(", ")}`,
      { field: "fields" },
    );
  }

  const selected = new Set<SummaryField>([
    ...REQUIRED_FIELDS,
    ...(requested as readonly SummaryField[]),
  ]);

  return SUMMARY_FIELDS.filter((field) => selected.has(field));
}

export function project(
  summary: EntrySummary,
  fields: readonly SummaryField[] | null,
): Partial<EntrySummary> {
  if (fields === null) return summary;

  const output: Record<string, unknown> = {};
  for (const field of fields) {
    const value = summary[field];
    if (value !== undefined) output[field] = value;
  }

  return output as Partial<EntrySummary>;
}

export type ListQuery = {
  readonly limit: number;
  readonly cursor: Cursor | null;
  readonly fields: readonly SummaryField[] | null;
};

export function parseListQuery(url: URL): ListQuery {
  return {
    limit: parseLimit(url.searchParams.get("limit")),
    cursor: parseCursor(url.searchParams.get("cursor")),
    fields: parseFields(url.searchParams.get("fields")),
  };
}
