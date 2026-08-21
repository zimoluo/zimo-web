import { AppError } from "../../lib/errors";
import { parseSlug } from "../../features/entries/model/ids";
import type { Slug } from "../../features/entries/model/ids";
import { isSection, SECTIONS } from "../../features/entries/model/types";
import type { Section } from "../../features/entries/model/types";

export function requireSection(raw: string | undefined): Section {
  if (raw !== undefined && isSection(raw)) return raw;
  throw new AppError(
    "not-found",
    `no such section; expected one of ${SECTIONS.join(", ")}`,
    { field: "section" },
  );
}

export function requireSlugParam(raw: string | undefined): Slug {
  const slug = raw === undefined ? null : parseSlug(raw);
  if (slug === null) {
    throw new AppError("not-found", "no such entry", { field: "slug" });
  }
  return slug;
}

export type EntryParams = { readonly section: Section; readonly slug: Slug };

export function requireEntryParams(raw: {
  readonly section?: string;
  readonly slug?: string;
}): EntryParams {
  return {
    section: requireSection(raw.section),
    slug: requireSlugParam(raw.slug),
  };
}

const REJECTED_PARAMS = ["directory", "mode", "filePath", "sub"] as const;

export function rejectLegacyParams(url: URL): void {
  const found = REJECTED_PARAMS.filter((name) => url.searchParams.has(name));
  if (found.length === 0) return;
  throw new AppError(
    "invalid-request",
    `${found.join(", ")} ${found.length === 1 ? "is" : "are"} not part of this API`,
    { fields: found },
  );
}
