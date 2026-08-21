import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve as resolvePath } from "node:path";

const ROOT = resolvePath(import.meta.dirname, "..");
const SCAN_ROOTS = ["app", "components", "lib", "styles", "src"];
const PROBE_DIR = join(ROOT, "src/styles/__unapply");
const GLOBALS = join(ROOT, "src/styles/globals.css");

const args = new Set(process.argv.slice(2));
const write = args.has("--write");

const LEGACY_COLOR_RENAMES: readonly (readonly [RegExp, string])[] = [
  [/\bprimary\b/, "text"],
  [/\bsaturated\b/, "text-muted"],
  [/\bpastel\b/, "fill"],
  [/\blight\b/, "panel"],
  [/\bhighlight-(primary|saturated|pastel|light)\b/, "edge"],
  [/\bdarklight-(primary|saturated|pastel|light)\b/, "shade"],
];

const COLOR_PREFIXES = ["text-", "bg-", "border-", "outline-", "ring-", "divide-", "fill-", "stroke-"];

const renameClass = (name: string): string => {
  if (name === "font-main") return "font-sans";

  for (const prefix of COLOR_PREFIXES) {
    if (!name.startsWith(prefix)) continue;
    const rest = name.slice(prefix.length);
    for (const [pattern, replacement] of LEGACY_COLOR_RENAMES) {
      if (pattern.test(rest)) return `${prefix}${rest.replace(pattern, replacement)}`;
    }
  }
  return name;
};

type Site = {
  readonly file: string;
  readonly raw: string;
  readonly classes: readonly string[];
  readonly important: boolean;
};

const collectFiles = (entry: string, out: string[]): void => {
  let info;
  try {
    info = statSync(entry);
  } catch {
    return;
  }
  if (info.isDirectory()) {
    for (const child of readdirSync(entry)) {
      if (child === "node_modules" || child.startsWith(".") || child === "__unapply") continue;
      collectFiles(join(entry, child), out);
    }
    return;
  }
  if (entry.endsWith(".css")) out.push(entry);
};

const files: string[] = [];
for (const root of SCAN_ROOTS) collectFiles(join(ROOT, root), files);

const APPLY_PATTERN = /@apply\s+([^;}]+);/g;

const sites: Site[] = [];
for (const file of files) {
  const source = readFileSync(file, "utf8");
  APPLY_PATTERN.lastIndex = 0;
  let match = APPLY_PATTERN.exec(source);
  while (match !== null) {
    const body = (match[1] ?? "").trim();
    const tokens = body.split(/\s+/).filter((token) => token.length > 0);
    const important = tokens.includes("!important");
    sites.push({
      file,
      raw: match[0],
      classes: tokens.filter((token) => token !== "!important").map(renameClass),
      important,
    });
    match = APPLY_PATTERN.exec(source);
  }
}

const allClasses = [...new Set(sites.flatMap((site) => site.classes))].sort();

console.log(`=== codemod-unapply ===`);
console.log(`@apply sites   : ${sites.length}`);
console.log(`css files      : ${new Set(sites.map((site) => site.file)).size}`);
console.log(`distinct utils : ${allClasses.length}`);
console.log();

mkdirSync(PROBE_DIR, { recursive: true });
writeFileSync(
  join(PROBE_DIR, "probe.tsx"),
  `export const probe = <i className="${allClasses.join(" ")}" />;\n`,
  "utf8",
);

const compiledPath = join(PROBE_DIR, "compiled.css");
execFileSync(
  "npx",
  ["@tailwindcss/cli", "-i", GLOBALS, "-o", compiledPath],
  { cwd: ROOT, stdio: "pipe" },
);

const compiled = readFileSync(compiledPath, "utf8");

const escapeClass = (name: string): string =>
  name.replace(/[.:/[\]()!%,#*+~>=^$|?{}\\]/g, (character) => `\\${character}`);

const declarationsFor = (name: string): readonly string[] | null => {
  const selector = `.${escapeClass(name)}`;
  const index = compiled.indexOf(`${selector} {`);
  if (index === -1) return null;

  const open = compiled.indexOf("{", index);
  let depth = 0;
  let end = open;
  for (let i = open; i < compiled.length; i += 1) {
    if (compiled[i] === "{") depth += 1;
    if (compiled[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  const body = compiled.slice(open + 1, end);
  if (body.includes("{")) return null;

  return body
    .split(";")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const resolved = new Map<string, readonly string[]>();
const unresolved: string[] = [];

for (const name of allClasses) {
  const declarations = declarationsFor(name);
  if (declarations === null || declarations.length === 0) unresolved.push(name);
  else resolved.set(name, declarations);
}

console.log(`resolved       : ${resolved.size}`);
console.log(`unresolved     : ${unresolved.length}`);
if (unresolved.length > 0) {
  console.log();
  console.log("unresolved utilities (need hand treatment):");
  for (const name of unresolved) console.log(`  ${name}`);
}
console.log();

let rewritten = 0;
let skipped = 0;
const perFile = new Map<string, { before: string; after: string }>();

for (const file of new Set(sites.map((site) => site.file))) {
  let source = readFileSync(file, "utf8");
  const original = source;

  for (const site of sites.filter((candidate) => candidate.file === file)) {
    if (site.classes.some((name) => !resolved.has(name))) {
      skipped += 1;
      continue;
    }

    const declarations = site.classes.flatMap((name) => resolved.get(name) ?? []);
    const suffix = site.important ? " !important" : "";
    const replacement = declarations
      .map((declaration) => `${declaration}${suffix};`)
      .join("\n  ");

    source = source.replace(site.raw, replacement);
    rewritten += 1;
  }

  if (source !== original) perFile.set(file, { before: original, after: source });
}

console.log(`rewritable     : ${rewritten}`);
console.log(`left by hand   : ${skipped}`);
console.log();

if (!write) {
  rmSync(PROBE_DIR, { recursive: true, force: true });
  console.log("dry run; pass --write to apply. Nothing changed.");
  process.exit(0);
}

for (const [file, { after }] of perFile) writeFileSync(file, after, "utf8");
rmSync(PROBE_DIR, { recursive: true, force: true });

const remaining = files.reduce((count, file) => {
  const source = readFileSync(file, "utf8");
  return count + (source.match(/@apply/g) ?? []).length;
}, 0);

console.log(`wrote ${perFile.size} files`);
console.log(`@apply remaining in repository: ${remaining}`);
process.exit(0);
