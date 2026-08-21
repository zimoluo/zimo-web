# features/search

One search module. `H-07` in the ledger.

## The grammar

Comma-separated terms, combined with **AND**. Any of `,` `;` `，` `；` separates them, so a query
typed on a CJK keyboard works without switching punctuation.

| Term | Means |
| --- | --- |
| `gradient` | free text — substring of the title, or of the description with its inline marks stripped |
| `#design` | tag — prefix match, case-insensitive |
| `:zimo` | author — prefix match, case-insensitive |
| `-gradient` | negation — anything the term would have matched is excluded |

`-#design` and `-:guest` negate a tag and an author. A term whose body is empty after trimming is
dropped, so `#`, `:` and stray separators match everything rather than nothing.

Examples:

```
#design, paint            tagged design AND mentioning paint
:zimo, -#draft            written by Zimo AND not tagged draft
window, -metaphors        mentions window AND does not mention metaphors
```

## Why this exists

`H-07`: the grammar was implemented inline in `SearchCardColumn.tsx` and documented nowhere, so it
was discoverable only by reading that file. `FilterSearchProvider` was instantiated in four places,
each holding its own query string next to its own `SearchBar`, and there was no cross-section search
at all.

`parseQuery` returns a structure rather than a split string, so the same code serves one section or
every section — `filterEntries` takes any array of `{ title, description?, tags?, authors? }`. The
four in-page boxes become thin views over it, and the command palette (`U2 §2.2`) is the fifth
consumer and the first global one.

## What this owns

Parsing and matching, and nothing else. It holds no state, touches no DOM, and does not know what an
entry is beyond the four fields it reads.

`matchesQuery` and `filterEntries` take the mark-stripping function as an argument rather than
importing it, so the module has no dependency on `features/document`. Pass
`stripMarks` from `features/document/marks`.

## Negation is new

v10 had no way to exclude. It is added because the four scoped boxes were the only search surface and
exclusion is what a global palette needs first — "everything except drafts" is not expressible by
narrowing alone.
