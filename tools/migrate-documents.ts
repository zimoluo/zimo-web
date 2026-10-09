import matter from "gray-matter";
import { backupObjects, restoreBackup } from "./migrate/backup";
import { createLocalObjectStore } from "../src/server/storage/local-store";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve as resolvePath } from "node:path";
import {
  migrateDocument,
  migrateInlineMarks,
} from "@/src/features/document/migrate-syntax";
import type { MigrationIssue } from "@/src/features/document/migrate-syntax";
import { parseDocument } from "@/src/features/document/parse";

const ROOT = resolvePath(import.meta.dirname, "..");

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const positional = args.filter((arg) => !arg.startsWith("--"));

const source = positional[0];
const commit = flags.has("--commit");
const reportPath = join(ROOT, "out/document-migration.json");

const MARK_FIELDS = new Set([
  "description",
  "caption",
  "text",
  "summary",
  "subtitle",
  "title",
]);

if (source === undefined) {
  console.error(
    [
      "usage: migrate-documents <dir> [--commit]",
      "",
      "  <dir>      a directory of .md documents and .json entries",
      "             (a local copy of the S3 prefix)",
      "  --commit   write the rewritten files; omit for a dry run",
      "",
      "  .md files    have their &&{Component}{props}&& blocks and @@glyph@@",
      "               tokens rewritten to directives",
      "  .json files  have the v10 inline mark grammar rewritten in their text",
      "               fields only -- documents are real Markdown already",
      "",
      "Always dry-run first. D6 §1 requires a backup and a tested restore before",
      "--commit runs against anything you cannot recreate.",
    ].join("\n"),
  );
  process.exit(2);
}

const collect = (entry: string, out: string[]): void => {
  const info = statSync(entry);
  if (info.isDirectory()) {
    for (const child of readdirSync(entry)) {
      if (child.startsWith(".")) continue;
      collect(join(entry, child), out);
    }
    return;
  }
  if (entry.endsWith(".md") || entry.endsWith(".json")) out.push(entry);
};

const files: string[] = [];
collect(resolvePath(source), files);
files.sort();

type Row = {
  readonly file: string;
  readonly changes: number;
  readonly issues: readonly MigrationIssue[];
  readonly kinds: Readonly<Record<string, number>>;
  readonly parseErrors: number;
  readonly deprecations: number;
  readonly changed: boolean;
};

const rows: Row[] = [];
const pending = new Map<string, string>();

const migrateJsonMarks = (
  source: string,
): { readonly text: string; readonly changes: readonly { readonly kind: string }[] } => {
  const changes: { readonly kind: string }[] = [];

  const walk = (value: unknown, key?: string): unknown => {
    if (typeof value === "string") {
      if (key === undefined || !MARK_FIELDS.has(key)) return value;
      const result = migrateInlineMarks(value);
      changes.push(...result.changes);
      return result.markdown;
    }
    if (Array.isArray(value)) return value.map((entry) => walk(entry, key));
    if (typeof value === "object" && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([name, entry]) => [name, walk(entry, name)]),
      );
    }
    return value;
  };

  const parsed: unknown = JSON.parse(source);
  if (typeof parsed === "object" && parsed !== null && "schema" in parsed && parsed.schema === 2) return { text: source, changes: [] };
  const result = walk(parsed);
  const migrated = typeof result === "object" && result !== null && !Array.isArray(result) ? { ...result, schema: 2 } : result;
  return { text: `${JSON.stringify(migrated, null, 2)}\n`, changes };
};

for (const file of files) {
  const original = readFileSync(file, "utf8");
  const isJson = file.endsWith(".json");

  let migrated: string;
  let changes: readonly { readonly kind: string }[];
  let documentIssues: readonly MigrationIssue[] = [];

  if (isJson) {
    try {
      const result = migrateJsonMarks(original);
      migrated = result.text;
      changes = result.changes;
    } catch (error) {
      migrated = original;
      changes = [];
      documentIssues = [
        { kind: "unparseable-json", message: `not valid JSON: ${(error as Error).message}` },
      ];
    }
  } else {
    const front = matter(original);
    const document = front.data.formatVersion === 2 ? { markdown: front.content, changes: [], issues: [] } : migrateDocument(front.content, { legacyMarks: true });
    migrated = front.data.formatVersion === 2 ? original : matter.stringify(document.markdown, { ...front.data, formatVersion: 2 });
    changes = document.changes;
    documentIssues = document.issues;
  }

  const kinds: Record<string, number> = {};
  for (const change of changes) kinds[change.kind] = (kinds[change.kind] ?? 0) + 1;

  const parsed = isJson ? null : await parseDocument(matter(migrated).content);

  rows.push({
    file: relative(ROOT, file),
    changes: changes.length,
    issues: documentIssues,
    kinds,
    parseErrors:
      parsed === null
        ? 0
        : parsed.issues.filter((issue) => issue.severity === "error").length,
    deprecations:
      parsed === null
        ? 0
        : parsed.issues.filter((issue) => issue.severity === "deprecated").length,
    changed: migrated !== original,
  });

  if (migrated !== original) pending.set(file, migrated);
}

const total = (pick: (row: Row) => number): number =>
  rows.reduce((sum, row) => sum + pick(row), 0);

const kindTotals = new Map<string, number>();
for (const row of rows) {
  for (const [kind, count] of Object.entries(row.kinds)) {
    kindTotals.set(kind, (kindTotals.get(kind) ?? 0) + count);
  }
}

console.log("=== document migration ===");
console.log(`documents        : ${rows.length}`);
console.log(`would change     : ${rows.filter((row) => row.changed).length}`);
console.log(`rewrites         : ${total((row) => row.changes)}`);
console.log(`blocking issues  : ${total((row) => row.issues.length)}`);
console.log(`parse errors     : ${total((row) => row.parseErrors)}`);
console.log(`deprecations left: ${total((row) => row.deprecations)}`);
console.log(`json entries     : ${files.filter((file) => file.endsWith(".json")).length}`);
console.log();

if (kindTotals.size > 0) {
  console.log("rewrites by kind:");
  for (const [kind, count] of [...kindTotals].sort(([, a], [, b]) => b - a)) {
    console.log(`  ${kind.padEnd(28)} ${count}`);
  }
  console.log();
}

const problems = rows.filter((row) => row.issues.length > 0 || row.parseErrors > 0);
if (problems.length > 0) {
  console.log("documents needing a human:");
  for (const row of problems) {
    console.log(`  ${row.file}`);
    for (const issue of row.issues) {
      console.log(`    ${issue.kind} @${issue.line ?? "?"}: ${issue.message}`);
    }
    if (row.parseErrors > 0) {
      console.log(`    ${row.parseErrors} parse error(s) after migration`);
    }
  }
  console.log();
}

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      committed: commit,
      documents: rows.length,
      rewrites: total((row) => row.changes),
      blockingIssues: total((row) => row.issues.length),
      parseErrors: total((row) => row.parseErrors),
      deprecationsRemaining: total((row) => row.deprecations),
      byKind: Object.fromEntries(kindTotals),
      files: rows,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`wrote ${relative(ROOT, reportPath)}`);

if (!commit) {
  console.log("\ndry run: nothing written. Re-run with --commit to apply.");
  process.exit(problems.length > 0 ? 1 : 0);
}

if (problems.length > 0) { console.error("Migration blocked: no source files were changed."); process.exit(1); }
const sourceRoot = resolvePath(source);
const store = createLocalObjectStore(sourceRoot);
const backupRoot = join(ROOT,"work","document-backup",new Date().toISOString().replaceAll(":","-"));
await backupObjects(store,[...pending.keys()].map((file) => relative(sourceRoot,file)),backupRoot);
await restoreBackup(createLocalObjectStore(`${backupRoot}/restore-check`),backupRoot);
for (const [file, migrated] of pending) writeFileSync(file, migrated, "utf8");
console.log(`\nrewrote ${pending.size} document(s)`);

process.exit(total((row) => row.parseErrors) > 0 ? 1 : 0);
