import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve as resolvePath } from "node:path";

const ROOT = resolvePath(import.meta.dirname, "..");
const INTERFACES = join(ROOT, "interfaces");
const SCAN_ROOTS = ["app", "components", "lib", "src"];

const args = new Set(process.argv.slice(2));
const write = args.has("--write");

const DESTINATIONS: Readonly<Record<string, string>> = {
  "blog/post.ts": "src/features/entries/model/blog.ts",
  "photos/entry.ts": "src/features/entries/model/album.ts",
  "projects/entry.ts": "src/features/entries/model/projects.ts",
  "entry.ts": "src/features/entries/model/entry.ts",
  "comment.ts": "src/features/comments/model/types.ts",
  "window.ts": "src/features/windows/model/types.ts",
  "toast.ts": "src/features/notifications/model/types.ts",
  "notebook.ts": "src/features/notebook/model/types.ts",
  "user.ts": "src/features/account/model/types.ts",
  "settings.ts": "src/features/settings/model/types.ts",
  "design/themeMaker.ts": "src/features/theme/studio/model/types.ts",
  "special/christmas.ts": "src/features/christmas-tree/model/types.ts",
  "popUp.ts": "src/features/overlays/model/types.ts",
  "navigation.ts": "src/lib/navigation-types.ts",
  "time.ts": "src/lib/time-types.ts",
  "util.ts": "src/lib/util-types.ts",
  "theme.ts": "src/features/theme/model/v10-types.ts",
};

const collect = (entry: string, out: string[], extensions: readonly string[]): void => {
  let info;
  try {
    info = statSync(entry);
  } catch {
    return;
  }
  if (info.isDirectory()) {
    for (const child of readdirSync(entry)) {
      if (child === "node_modules" || child.startsWith(".")) continue;
      collect(join(entry, child), out, extensions);
    }
    return;
  }
  if (extensions.some((extension) => entry.endsWith(extension))) out.push(entry);
};

const interfaceFiles: string[] = [];
collect(INTERFACES, interfaceFiles, [".ts"]);

const migrated = interfaceFiles.length === 0;

const DECLARATION = /^(?:export\s+)?(?:declare\s+)?(type|interface|enum)\s+([A-Za-z0-9_]+)/gm;

type Module = {
  readonly relativeKey: string;
  readonly destination: string;
  readonly names: readonly string[];
  readonly source: string;
};

const modules: Module[] = [];
const owner = new Map<string, Module>();
const duplicates: string[] = [];

const inputs: readonly (readonly [string, string])[] = migrated
  ? Object.entries(DESTINATIONS).map(([key, destination]) => [key, join(ROOT, destination)])
  : interfaceFiles.map((file) => [relative(INTERFACES, file), file]);

for (const [relativeKey, file] of inputs) {
  const destination = DESTINATIONS[relativeKey];
  if (destination === undefined) {
    throw new Error(`No destination mapped for interfaces/${relativeKey}`);
  }

  const source = readFileSync(file, "utf8");
  const names: string[] = [];
  DECLARATION.lastIndex = 0;
  let match = DECLARATION.exec(source);
  while (match !== null) {
    const name = match[2];
    if (name !== undefined) names.push(name);
    match = DECLARATION.exec(source);
  }

  const typeModule: Module = { relativeKey, destination, names, source };
  modules.push(typeModule);

  for (const name of names) {
    if (owner.has(name)) duplicates.push(name);
    else owner.set(name, typeModule);
  }
}

console.log("=== codemod-interfaces ===");
console.log(migrated ? "mode          : re-run over migrated modules" : "mode          : initial migration from interfaces/");
console.log(`ambient files : ${modules.length}`);
console.log(`type names    : ${owner.size}`);
if (duplicates.length > 0) console.log(`duplicates    : ${duplicates.join(", ")}`);
console.log();

const sourceFiles: string[] = [];
for (const root of SCAN_ROOTS) collect(join(ROOT, root), sourceFiles, [".ts", ".tsx"]);

const importPathFor = (fromFile: string, destination: string): string => {
  const absolute = join(ROOT, destination).replace(/\.ts$/, "");
  let path = relative(dirname(fromFile), absolute).split("\\").join("/");
  if (!path.startsWith(".")) path = `./${path}`;
  return path;
};

const localDeclarations = (source: string): ReadonlySet<string> => {
  const names = new Set<string>();
  const pattern =
    /(?:^|\n)\s*(?:export\s+)?(?:declare\s+)?(?:type|interface|enum|class|const|let|var|function)\s+([A-Za-z0-9_]+)/g;
  let match = pattern.exec(source);
  while (match !== null) {
    const name = match[1];
    if (name !== undefined) names.add(name);
    match = pattern.exec(source);
  }
  return names;
};

const alreadyImported = (source: string): ReadonlySet<string> => {
  const names = new Set<string>();

  const braced = /import\s+(?:type\s+)?\{([^}]*)\}/g;
  let match = braced.exec(source);
  while (match !== null) {
    for (const part of (match[1] ?? "").split(",")) {
      const name = part.trim().split(/\s+as\s+/)[0]?.trim();
      if (name !== undefined && name.length > 0) names.add(name);
    }
    match = braced.exec(source);
  }

  const bare = /import\s+(?:type\s+)?(?:([A-Za-z0-9_$]+)|\*\s+as\s+([A-Za-z0-9_$]+))\s*(?:,|from)/g;
  match = bare.exec(source);
  while (match !== null) {
    const name = match[1] ?? match[2];
    if (name !== undefined) names.add(name);
    match = bare.exec(source);
  }

  return names;
};

let touched = 0;
let injections = 0;
const edits = new Map<string, string>();

for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  const declared = localDeclarations(source);
  const imported = alreadyImported(source);

  const needed = new Map<Module, Set<string>>();

  for (const [name, owningModule] of owner) {
    if (declared.has(name) || imported.has(name)) continue;
    if (!new RegExp(`\\b${name}\\b`).test(source)) continue;

    const bucket = needed.get(owningModule) ?? new Set<string>();
    bucket.add(name);
    needed.set(owningModule, bucket);
  }

  if (needed.size === 0) continue;

  const statements = [...needed]
    .map(([owningModule, names]) => {
      const path = importPathFor(file, owningModule.destination);
      return `import type { ${[...names].sort().join(", ")} } from "${path}";`;
    })
    .sort();

  const lines = source.split("\n");
  let insertAt = 0;

  if (lines[0]?.startsWith('"use client"') || lines[0]?.startsWith("'use client'")) {
    insertAt = 1;
    while (insertAt < lines.length && lines[insertAt]?.trim() === "") insertAt += 1;
  }

  const updated = [
    ...lines.slice(0, insertAt),
    ...statements,
    ...lines.slice(insertAt),
  ].join("\n");

  edits.set(file, updated);
  touched += 1;
  injections += statements.length;
}

console.log(`files needing imports : ${touched}`);
console.log(`import statements     : ${injections}`);
console.log();

if (!write) {
  console.log("dry run; pass --write to apply. Nothing changed.");
  process.exit(0);
}

if (!migrated) {
  for (const typeModule of modules) {
    const target = join(ROOT, typeModule.destination);
    mkdirSync(dirname(target), { recursive: true });

    const exported = typeModule.source.replace(
      /^(\s*)(?:export\s+)?(type|interface|enum)\s+/gm,
      (_full, indent: string, keyword: string) => `${indent}export ${keyword} `,
    );

    writeFileSync(target, exported, "utf8");
  }
}

for (const [file, updated] of edits) writeFileSync(file, updated, "utf8");

if (!migrated) console.log(`wrote ${modules.length} type modules`);
console.log(`updated ${edits.size} source files`);
