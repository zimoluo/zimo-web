import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve as resolvePath } from "node:path";
import { createObjectStore } from "@/src/server/storage/object";
import { s3 } from "@/src/server/storage/client";
import type { ObjectStore } from "@/src/server/storage/object";

type Args = {
  readonly source: string;
  readonly confirm: boolean;
  readonly prefixes: readonly string[];
};

const usage = `usage: restore <backup-directory> [--confirm] [--prefix=blog/comments/]

  <backup-directory>  a directory tools/backup.ts wrote, containing manifest.json
  --confirm           actually write to the bucket. Without it, nothing is written
  --prefix            restrict to one prefix; repeatable

Every object is written unconditionally, which is the point of a restore: it is
the one write path in the repository that deliberately overwrites whatever is
there. Run it with no --confirm first and read the list.`;

type Manifest = {
  readonly at: string;
  readonly prefixes: readonly string[];
  readonly objects: number;
  readonly listed: number;
};

function parseArgs(argv: readonly string[]): Args {
  const positional: string[] = [];
  const prefixes: string[] = [];
  let confirm = false;

  for (const arg of argv) {
    if (arg === "--confirm") confirm = true;
    else if (arg.startsWith("--prefix=")) prefixes.push(arg.slice("--prefix=".length));
    else if (arg.startsWith("--")) throw new Error(`unknown flag: ${arg}`);
    else positional.push(arg);
  }

  const source = positional[0];
  if (source === undefined) throw new Error(usage);

  return { source, confirm, prefixes };
}

function walk(root: string, current: string, out: string[]): void {
  for (const name of readdirSync(current).sort()) {
    const path = join(current, name);
    if (statSync(path).isDirectory()) walk(root, path, out);
    else out.push(relative(root, path));
  }
}

function readManifest(root: string): Manifest {
  const path = join(root, "manifest.json");
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Manifest;
  } catch {
    throw new Error(`no readable manifest.json in ${root}`);
  }
}

async function main(argv: readonly string[]): Promise<number> {
  const args = parseArgs(argv);
  const root = resolvePath(args.source);
  const manifest = readManifest(root);

  const files: string[] = [];
  walk(root, root, files);

  const keys = files
    .filter((file) => file !== "manifest.json")
    .filter(
      (file) =>
        args.prefixes.length === 0 ||
        args.prefixes.some((prefix) => file.startsWith(prefix)),
    );

  console.log(`=== restore ${root}`);
  console.log(`taken at ${manifest.at}; ${manifest.objects} object(s) written then`);
  console.log(`${keys.length} object(s) to write now:\n`);
  for (const key of keys) console.log(`  ${key}`);

  if (!args.confirm) {
    console.log(`\nrestore: nothing written. Re-run with --confirm.`);
    return 0;
  }

  const store: ObjectStore = createObjectStore(s3() as never);
  let written = 0;

  for (const key of keys) {
    const body = readFileSync(join(root, key), "utf8");
    await store.writeText(key, body);
    written += 1;
  }

  console.log(`\nrestore: ${written} object(s) written.`);
  return written === keys.length ? 0 : 1;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 2;
}
