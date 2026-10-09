import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve as resolvePath } from "node:path";
import { buildIndex, clean, describeDrift, diffIndex } from "@/src/features/entries/index-build";
import { parseSectionIndex, parseStoredEntry } from "@/src/features/entries/model/schema";
import type { StoredEntry } from "@/src/features/entries/model/schema";
import { SECTIONS } from "@/src/features/entries/model/types";
import type { Section, SectionIndex } from "@/src/features/entries/model/types";
import { entryFormat, keys, slugFromKey } from "@/src/server/storage/keys";

type Args = {
  readonly directory: string;
  readonly check: boolean;
  readonly commit: boolean;
  readonly sections: readonly Section[];
  readonly builtAt: string;
};

const usage = `usage: reindex <directory> [--check] [--commit] [--section=blog] [--at=<iso>]

  <directory>   a local tree mirroring the bucket: <section>/entries/*.json,
                <section>/documents/*.md, <section>/index.json
  --check       compare the existing index against the entries and exit 1 on drift
  --section     restrict to one section; repeatable
  --at          the builtAt timestamp to write (default: now)`;

function parseArgs(argv: readonly string[]): Args {
  const positional: string[] = [];
  let check = false;
  let commit = false;
  const sections: Section[] = [];
  let builtAt = new Date().toISOString();

  for (const arg of argv) {
    if (arg === "--commit") { commit = true; } else if (arg === "--check") {
      check = true;
    } else if (arg.startsWith("--section=")) {
      const value = arg.slice("--section=".length);
      if (!(SECTIONS as readonly string[]).includes(value)) {
        throw new Error(`unknown section: ${value}`);
      }
      sections.push(value as Section);
    } else if (arg.startsWith("--at=")) {
      builtAt = arg.slice("--at=".length);
    } else if (arg.startsWith("--")) {
      throw new Error(`unknown flag: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  const directory = positional[0];
  if (directory === undefined) throw new Error(usage);

  return {
    directory,
    check,
    commit,
    sections: sections.length === 0 ? SECTIONS : sections,
    builtAt,
  };
}

const exists = (path: string): boolean => {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
};

function readEntries(root: string, section: Section): readonly StoredEntry[] {
  const prefix = keys.entryPrefix(section);
  const directory = join(root, prefix);
  if (!exists(directory)) return [];

  const format = entryFormat(section);
  const entries: StoredEntry[] = [];

  for (const name of readdirSync(directory).sort()) {
    if (!name.endsWith(`.${format}`)) continue;

    const slug = slugFromKey(section, `${prefix}${name}`);
    if (slug === null) {
      console.warn(`  skipped ${name}: not a valid slug`);
      continue;
    }

    const path = join(directory, name);

    if (format === "json") {
      entries.push(parseStoredEntry(JSON.parse(readFileSync(path, "utf8"))));
      continue;
    }

    const sidecar = join(directory, `${slug}.meta.json`);
    if (!exists(sidecar)) {
      console.warn(`  skipped ${name}: no ${slug}.meta.json beside the document`);
      continue;
    }

    entries.push(parseStoredEntry(JSON.parse(readFileSync(sidecar, "utf8"))));
  }

  return entries;
}

function readIndex(root: string, section: Section): SectionIndex | null {
  const path = join(root, keys.sectionIndex(section));
  if (!exists(path)) return null;
  return parseSectionIndex(JSON.parse(readFileSync(path, "utf8")));
}

function main(argv: readonly string[]): number {
  const args = parseArgs(argv);
  const root = resolvePath(args.directory);
  let failures = 0;

  console.log(`=== reindex ${args.check ? "(check)" : ""} ${root}`);

  for (const section of args.sections) {
    const entries = readEntries(root, section);
    const rebuilt = buildIndex(section, entries, args.builtAt);

    if (!args.check) {
      console.log(
        `${section}: ${entries.length} entr${entries.length === 1 ? "y" : "ies"} -> ${keys.sectionIndex(section)}`,
      );
      if (args.commit) { mkdirSync(join(root, section), { recursive: true }); writeFileSync(join(root, keys.sectionIndex(section)), `${JSON.stringify(rebuilt, null, 2)}\n`); } else console.log(JSON.stringify({ ...rebuilt, dryRun: true }, null, 2));
      continue;
    }

    const existing = readIndex(root, section);

    if (existing === null) {
      if (entries.length === 0) {
        console.log(`${section}: no entries and no index`);
        continue;
      }
      console.error(`${section}: no index, but ${entries.length} entries exist`);
      failures += 1;
      continue;
    }

    const drift = diffIndex(existing, entries);
    console.log(describeDrift(section, drift));
    if (!clean(drift)) failures += 1;
  }

  if (args.check) {
    console.log(
      failures === 0
        ? "\nreindex: every index matches its entries."
        : `\nreindex: ${failures} section(s) drifted.`,
    );
  }

  return failures === 0 ? 0 : 1;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 2;
}
