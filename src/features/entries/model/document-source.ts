import matter from "gray-matter";
import { parseStoredEntry, type StoredEntry } from "./schema";

export type StoredDocument = { readonly entry: StoredEntry | null; readonly markdown: string };

export function decodeStoredDocument(text: string): StoredDocument {
  const document = matter(text);
  const version = document.data.formatVersion;
  if (version !== undefined && version !== 2 && version !== 3) throw new Error("Unsupported stored document format");
  const canonical = version === 3 || ["section", "slug", "extras", "images"].some((key) => Object.hasOwn(document.data, key));
  if (!canonical) return { entry: null, markdown: document.content };
  const { markdown: _redundant, ...entry } = parseStoredEntry(document.data);
  return { entry, markdown: document.content };
}

export function encodeStoredDocument(entry: StoredEntry, markdown: string): string {
  const { markdown: _redundant, ...metadata } = parseStoredEntry(entry);
  return matter.stringify(markdown, { formatVersion: 3, ...metadata });
}
