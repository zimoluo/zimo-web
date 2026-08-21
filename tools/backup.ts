import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { MUTABLE_PREFIXES } from "@/src/server/storage/keys";
import { createObjectStore } from "@/src/server/storage/object";
import { s3 } from "@/src/server/storage/client";
import type { ObjectRef, ObjectStore } from "@/src/server/storage/object";

type Args = {
  readonly destination: string;
  readonly prefixes: readonly string[];
  readonly dryRun: boolean;
  readonly at: string;
};

const usage = `usage: backup <destination> [--prefix=blog/comments/] [--dry-run] [--at=<iso>]

  <destination>  local directory; objects land under <destination>/<at>/<key>
  --prefix       restrict to one prefix; repeatable. Default: every mutable prefix
  --dry-run      list what would be copied and its size, and write nothing
  --at           the timestamp directory to write into (default: now)

Mutable prefixes, per D4 section 5:
${MUTABLE_PREFIXES.map((prefix) => `  ${prefix}`).join("\n")}`;

function parseArgs(argv: readonly string[]): Args {
  const positional: string[] = [];
  const prefixes: string[] = [];
  let dryRun = false;
  let at = new Date().toISOString();

  for (const arg of argv) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg.startsWith("--prefix=")) prefixes.push(arg.slice("--prefix=".length));
    else if (arg.startsWith("--at=")) at = arg.slice("--at=".length);
    else if (arg.startsWith("--")) throw new Error(`unknown flag: ${arg}`);
    else positional.push(arg);
  }

  const destination = positional[0];
  if (destination === undefined) throw new Error(usage);

  return {
    destination,
    prefixes: prefixes.length === 0 ? MUTABLE_PREFIXES : prefixes,
    dryRun,
    at,
  };
}

const kilobytes = (bytes: number): string => `${(bytes / 1024).toFixed(1)} KB`;

async function copy(
  store: ObjectStore,
  ref: ObjectRef,
  root: string,
): Promise<number> {
  const record = await store.readText(ref.key);
  if (record === null) return 0;

  const path = join(root, ref.key);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, record.value, "utf8");

  return Buffer.byteLength(record.value, "utf8");
}

async function main(argv: readonly string[]): Promise<number> {
  const args = parseArgs(argv);
  const store = createObjectStore(s3() as never);
  const root = resolvePath(args.destination, args.at);

  console.log(`=== backup ${args.dryRun ? "(dry run)" : `-> ${root}`}`);

  let objects = 0;
  let stored = 0;
  let listed = 0;

  for (const prefix of args.prefixes) {
    const refs = await store.list(prefix);
    listed += refs.length;

    if (refs.length === 0) {
      console.log(`${prefix}: empty`);
      continue;
    }

    const bytes = refs.reduce((total, ref) => total + ref.size, 0);
    console.log(`${prefix}: ${refs.length} object(s), ${kilobytes(bytes)} stored`);
    stored += bytes;

    if (args.dryRun) continue;

    const written = await Promise.all(refs.map((ref) => copy(store, ref, root)));
    objects += written.filter((size) => size > 0).length;
  }

  console.log(
    args.dryRun
      ? `\nbackup: ${listed} object(s), ${kilobytes(stored)} stored, nothing written.`
      : `\nbackup: ${objects} of ${listed} object(s) written under ${root}.`,
  );

  const manifest = {
    at: args.at,
    prefixes: args.prefixes,
    objects: args.dryRun ? 0 : objects,
    listed,
  };

  if (!args.dryRun) {
    mkdirSync(root, { recursive: true });
    writeFileSync(
      join(root, "manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8",
    );
    console.log(`manifest: ${join(root, "manifest.json")}`);
    console.log(`restore it with: npm run content:restore -- ${root} --confirm`);
  }

  return listed > 0 || args.dryRun ? 0 : 1;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 2;
}
