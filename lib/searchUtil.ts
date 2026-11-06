export interface SearchTerm {
  kind: "text" | "tag" | "author";
  value: string;
  negated: boolean;
}

export interface SearchableItem {
  title: string;
  description?: string;
  keywords?: string[];
  tags?: string[];
  authors?: string[];
}

export const foldSearchText = (value: string): string =>
  value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();

export function parseSearchQuery(input: string): SearchTerm[] {
  const terms: SearchTerm[] = [];
  const pattern = /(-?[#:]?)"([^"]*)"|([^\s,;，；]+)/g;
  for (const match of input.matchAll(pattern)) {
    let value = match[3] ?? `${match[1]}${match[2]}`;
    const negated = value.startsWith("-");
    if (negated) value = value.slice(1);
    const kind = value.startsWith("#") ? "tag" : value.startsWith(":") ? "author" : "text";
    if (kind !== "text") value = value.slice(1);
    value = foldSearchText(value.trim());
    if (value) terms.push({ kind, value, negated });
  }
  return terms;
}

export function scoreSearchItem(item: SearchableItem, terms: SearchTerm[]): number | null {
  const title = foldSearchText(item.title);
  const description = foldSearchText(item.description ?? "");
  const keywords = (item.keywords ?? []).map(foldSearchText);
  const tags = (item.tags ?? []).map(foldSearchText);
  const authors = (item.authors ?? []).map(foldSearchText);
  let score = 0;
  for (const term of terms) {
    const value = term.value;
    const rank = term.kind === "tag"
      ? tags.some((tag) => tag.startsWith(value)) ? 0 : null
      : term.kind === "author"
        ? authors.some((author) => author.startsWith(value)) ? 0 : null
        : title === value ? 0
          : title.startsWith(value) ? 1
            : title.split(/\s+/).some((word) => word.startsWith(value)) ? 2
              : title.includes(value) ? 3
                : keywords.some((keyword) => keyword.includes(value)) ? 4
                  : description.includes(value) || tags.some((tag) => tag.includes(value)) || authors.some((author) => author.includes(value)) ? 5 : null;
    if (term.negated ? rank !== null : rank === null) return null;
    if (!term.negated) score += rank ?? 0;
  }
  return score;
}

export function normalizeSearchEntry(
  section: EntrySection,
  entry: Record<string, unknown>,
  plainText: (value: string) => string,
): SiteSearchEntry | null {
  if (entry.unlisted || typeof entry.slug !== "string" || !entry.slug || /[/\\?#\s]/.test(entry.slug)) return null;
  const text = (value: unknown) => typeof value === "string" ? plainText(value).replace(/\s+/g, " ").trim() : "";
  const title = text(entry.title);
  if (!title) return null;
  const strings = (value: unknown): string[] => Array.isArray(value)
    ? value.flatMap((item) => typeof item === "string" ? [text(item)] : typeof item === "object" && item !== null && "name" in item ? [text(item.name)] : []).filter(Boolean)
    : typeof value === "string" && value.trim() ? [text(value)] : [];
  return {
    section, slug: entry.slug, title,
    description: text(entry.description) || (section === "photos" && typeof entry.location === "object" && entry.location !== null && "name" in entry.location ? text(entry.location.name) : ""),
    tags: strings(entry.tags), authors: strings(entry.authors ?? entry.author),
    date: text(entry.lastEditedDate ?? entry.date),
  };
}
