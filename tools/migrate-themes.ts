import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";
import { deltaEOk } from "../src/features/theme/color";
import { liftV1, verifyLift } from "../src/features/theme/model/lift-v1";
import { resolve as resolveTheme } from "../src/features/theme/model/resolve";
import type { LiftReport } from "../src/features/theme/model/lift-v1";
import type { LegacyThemeDataConfig } from "../src/features/theme/model/legacy";
import type { ThemeSource } from "../src/features/theme/model/types";

const ROOT = resolvePath(import.meta.dirname, "..");
const CONFIG_DIR = join(ROOT, "components/theme/config");
const OUT_DIR = join(ROOT, "src/features/theme/registry/themes");
const REGISTRY_INDEX = join(ROOT, "src/features/theme/registry/index.ts");
const REPORT_PATH = join(ROOT, "out/theme-migration.json");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

const kebab = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const titleCase = (value: string): string => {
  const spaced = value.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const serialize = (value: unknown, indent = 2): string => {
  const pad = " ".repeat(indent);

  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((item) => `${pad}  ${serialize(item, indent + 2)}`);
    return `[\n${items.join(",\n")}\n${pad}]`;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.kind === "literal" && typeof record.value === "string") {
      return `{ kind: "literal", value: literal(${JSON.stringify(record.value)}) }`;
    }
    const entries = Object.entries(record).filter(
      ([, entryValue]) => entryValue !== undefined,
    );
    if (entries.length === 0) return "{}";
    const items = entries.map(([key, entryValue]) => {
      const name = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      return `${pad}  ${name}: ${serialize(entryValue, indent + 2)}`;
    });
    return `{\n${items.join(",\n")}\n${pad}}`;
  }

  return "undefined";
};

const themeFile = (theme: ThemeSource, report: LiftReport): string => {
  const body = serialize(theme);
  const needsLiteral = body.includes("literal(");
  const header = needsLiteral
    ? 'import { literal } from "../../model/literal";\nimport type { ThemeSource } from "../../model/types";'
    : 'import type { ThemeSource } from "../../model/types";';

  return `${header}

export default ${body} satisfies ThemeSource;

export const migrationReport = ${serialize({
    scheme: report.scheme,
    purity: report.purity,
    maxDeltaEOk: report.maxDeltaEOk,
    flags: report.flags,
  })} as const;
`;
};

const files = readdirSync(CONFIG_DIR)
  .filter((name) => name.endsWith(".ts"))
  .sort();

type Migrated = {
  readonly legacyName: string;
  readonly id: string;
  readonly theme: ThemeSource;
  readonly report: LiftReport;
};

const migrated: Migrated[] = [];
const failures: { readonly id: string; readonly reason: string }[] = [];

for (const file of files) {
  const legacyName = file.replace(/\.ts$/, "");
  const id = kebab(legacyName);

  let config: LegacyThemeDataConfig;
  try {
    const module = await import(pathToFileURL(join(CONFIG_DIR, file)).href);
    config = module.default as LegacyThemeDataConfig;
  } catch (error) {
    failures.push({ id, reason: `import failed: ${(error as Error).message}` });
    continue;
  }

  if (config?.palette === undefined) {
    failures.push({ id, reason: "no palette on the default export" });
    continue;
  }

  try {
    const result = liftV1(id, titleCase(legacyName), config);
    const maxDeltaEOk = verifyLift(result, config, deltaEOk, resolveTheme);
    migrated.push({
      legacyName,
      id,
      theme: result.theme,
      report: { ...result.report, maxDeltaEOk: Number(maxDeltaEOk.toFixed(6)) },
    });
  } catch (error) {
    failures.push({ id, reason: `lift failed: ${(error as Error).message}` });
  }
}

migrated.sort((a, b) => a.id.localeCompare(b.id));

const TOLERANCE = 0.002;
const overTolerance = migrated.filter((entry) => entry.report.maxDeltaEOk > TOLERANCE);

console.log(`=== theme migration ===`);
console.log(`configs found      : ${files.length}`);
console.log(`migrated           : ${migrated.length}`);
console.log(`failed             : ${failures.length}`);
console.log(`over ${TOLERANCE} deltaE   : ${overTolerance.length}`);
console.log();

const worst = [...migrated].sort((a, b) => b.report.maxDeltaEOk - a.report.maxDeltaEOk);
console.log("worst 10 by maxDeltaEOk:");
for (const entry of worst.slice(0, 10)) {
  console.log(
    `  ${entry.id.padEnd(20)} ${entry.report.maxDeltaEOk.toFixed(6)}  ` +
      `scheme=${entry.report.scheme.padEnd(5)} purity=${entry.report.purity.toFixed(3)} ` +
      `literals=${entry.report.literalStops}`,
  );
}
console.log();

const purest = [...migrated].sort((a, b) => b.report.purity - a.report.purity);
console.log("purest 10 (candidates for hand simplification):");
for (const entry of purest.slice(0, 10)) {
  console.log(`  ${entry.id.padEnd(20)} purity=${entry.report.purity.toFixed(3)}`);
}
console.log();

if (failures.length > 0) {
  console.log("failures:");
  for (const failure of failures) console.log(`  ${failure.id.padEnd(20)} ${failure.reason}`);
  console.log();
}

const flagCounts = new Map<string, number>();
for (const entry of migrated) {
  for (const flag of entry.report.flags) {
    flagCounts.set(flag, (flagCounts.get(flag) ?? 0) + 1);
  }
}
console.log("flags:");
for (const [flag, count] of [...flagCounts].sort(([, a], [, b]) => b - a)) {
  console.log(`  ${flag.padEnd(22)} ${count}`);
}
console.log();

if (dryRun) {
  console.log("--dry-run: nothing written.");
  process.exit(overTolerance.length > 0 ? 1 : 0);
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(join(ROOT, "out"), { recursive: true });

for (const entry of migrated) {
  writeFileSync(join(OUT_DIR, `${entry.id}.ts`), themeFile(entry.theme, entry.report), "utf8");
}

const identifier = (id: string): string =>
  id.replace(/-([a-z0-9])/g, (_, character: string) => character.toUpperCase());

const imports = migrated
  .map((entry) => `import ${identifier(entry.id)} from "./themes/${entry.id}";`)
  .join("\n");

const members = migrated.map((entry) => `  "${entry.id}": ${identifier(entry.id)},`).join("\n");

const order = migrated.map((entry) => `  "${entry.id}",`).join("\n");

writeFileSync(
  REGISTRY_INDEX,
  `import type { ThemeSource } from "../model/types";
${imports}

const registry = {
${members}
} satisfies Record<string, ThemeSource>;

export type ThemeId = keyof typeof registry;

export const themeIds = Object.keys(registry) as readonly ThemeId[];

export const getTheme = (id: ThemeId): ThemeSource => registry[id];

export const themeOrder: readonly ThemeId[] = [
${order}
];

export const listedThemeIds: readonly ThemeId[] = themeOrder.filter(
  (id) => getTheme(id).hidden !== true,
);
`,
  "utf8",
);

writeFileSync(
  REPORT_PATH,
  `${JSON.stringify(
    {
      tolerance: TOLERANCE,
      migrated: migrated.length,
      failed: failures.length,
      overTolerance: overTolerance.map((entry) => entry.id),
      failures,
      themes: migrated.map((entry) => entry.report),
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`wrote ${migrated.length} theme files to ${OUT_DIR}`);
console.log(`wrote ${REGISTRY_INDEX}`);
console.log(`wrote ${REPORT_PATH}`);

process.exit(overTolerance.length > 0 ? 1 : 0);
