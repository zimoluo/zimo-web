export type QueryTerm =
  | { readonly kind: "tag"; readonly value: string; readonly negated: boolean }
  | { readonly kind: "author"; readonly value: string; readonly negated: boolean }
  | { readonly kind: "text"; readonly value: string; readonly negated: boolean };

export type Query = { readonly terms: readonly QueryTerm[] };

export type SearchableEntry = {
  readonly title: string;
  readonly description?: string | undefined;
  readonly tags?: readonly string[] | undefined;
  readonly authors?: readonly string[] | undefined;
};

const SEPARATORS = /[,;，；]+/;

/**
 * The grammar is what SearchCardColumn implemented inline and undocumented:
 * comma-separated terms combined with AND, `#` for a tag prefix match, `:` for
 * an author prefix match, anything else a substring match over title and
 * description. `-` negates a term, which is new.
 */
export function parseQuery(input: string): Query {
  const terms: QueryTerm[] = [];

  for (const raw of input.trim().split(SEPARATORS)) {
    const trimmed = raw.trim();
    if (trimmed.length === 0) continue;

    const negated = trimmed.startsWith("-") && trimmed.length > 1;
    const body = negated ? trimmed.slice(1).trim() : trimmed;
    if (body.length === 0) continue;

    if (body.startsWith("#")) {
      const value = body.slice(1).trim();
      if (value.length > 0) terms.push({ kind: "tag", value, negated });
      continue;
    }

    if (body.startsWith(":")) {
      const value = body.slice(1).trim();
      if (value.length > 0) terms.push({ kind: "author", value, negated });
      continue;
    }

    terms.push({ kind: "text", value: body, negated });
  }

  return { terms };
}

const fold = (value: string): string => value.toLocaleLowerCase();

const matchesList = (list: readonly string[], needle: string): boolean =>
  list.some((member) => fold(member).startsWith(fold(needle)));

const matchesText = (haystack: string, needle: string): boolean =>
  fold(haystack).includes(fold(needle));

export function matchesTerm(
  entry: SearchableEntry,
  term: QueryTerm,
  strip: (input: string) => string,
): boolean {
  const hit = ((): boolean => {
    switch (term.kind) {
      case "tag":
        return matchesList(entry.tags ?? [], term.value);
      case "author":
        return matchesList(entry.authors ?? [], term.value);
      case "text":
        return (
          matchesText(entry.title, term.value) ||
          (entry.description !== undefined &&
            matchesText(strip(entry.description), term.value))
        );
    }
  })();

  return term.negated ? !hit : hit;
}

export function matchesQuery(
  entry: SearchableEntry,
  query: Query,
  strip: (input: string) => string,
): boolean {
  return query.terms.every((term) => matchesTerm(entry, term, strip));
}

export function filterEntries<T extends SearchableEntry>(
  entries: readonly T[],
  input: string,
  strip: (value: string) => string,
): readonly T[] {
  const query = parseQuery(input);
  if (query.terms.length === 0) return entries;
  return entries.filter((entry) => matchesQuery(entry, query, strip));
}

export const describeQuery = (query: Query): string =>
  query.terms
    .map((term) => {
      const prefix = term.negated ? "not " : "";
      switch (term.kind) {
        case "tag":
          return `${prefix}tag ${term.value}`;
        case "author":
          return `${prefix}author ${term.value}`;
        case "text":
          return `${prefix}"${term.value}"`;
      }
    })
    .join(" and ");
