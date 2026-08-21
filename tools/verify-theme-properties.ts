import { readdirSync } from "node:fs";
import { join, resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";
import { deltaEOk } from "../src/features/theme/color";
import { hexToOklch, tripletToOklch } from "../src/features/theme/model/lift-v1";
import { resolve as resolveTheme } from "../src/features/theme/model/resolve";
import { compile } from "../src/features/theme/compile/compile";
import { getTheme, themeIds } from "../src/features/theme/registry";
import { themeSourceSchema } from "../src/features/theme/model/schema";
import type { LegacyThemeDataConfig } from "../src/features/theme/model/legacy";
import type { RoleName } from "../src/features/theme/model/types";

const ROOT = resolvePath(import.meta.dirname, "..");
const CONFIG_DIR = join(ROOT, "components/theme/config");
const TOLERANCE = 0.002;

const kebab = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const LEGACY_TO_ROLE: readonly (readonly [
  "primary" | "saturated" | "pastel" | "light",
  RoleName,
])[] = [
  ["primary", "text"],
  ["saturated", "textMuted"],
  ["pastel", "fill"],
  ["light", "panel"],
];

type Row = {
  readonly id: string;
  readonly present: boolean;
  readonly maxDeltaEOk: number;
  readonly worstRole: string;
  readonly schemaOk: boolean;
  readonly propertyCount: number;
};

const rows: Row[] = [];
const missingLegacy: string[] = [];

const legacyById = new Map<string, LegacyThemeDataConfig>();

for (const file of readdirSync(CONFIG_DIR).filter((name) => name.endsWith(".ts"))) {
  const id = kebab(file.replace(/\.ts$/, ""));
  try {
    const module = await import(pathToFileURL(join(CONFIG_DIR, file)).href);
    const config = module.default as LegacyThemeDataConfig;
    if (config?.palette !== undefined) legacyById.set(id, config);
  } catch {
    missingLegacy.push(id);
  }
}

for (const id of themeIds) {
  const source = getTheme(id);
  const schemaOk = themeSourceSchema.safeParse(source).success;

  const authoredScheme =
    source.schemes.kind === "single"
      ? source.schemes.scheme
      : source.schemes.mirrorDark === false
        ? "dark"
        : "light";

  const resolved = resolveTheme(source, authoredScheme);
  const propertyCount = compile(resolved).size;

  const legacy = legacyById.get(id);
  if (legacy === undefined) {
    rows.push({
      id,
      present: false,
      maxDeltaEOk: Number.NaN,
      worstRole: "-",
      schemaOk,
      propertyCount,
    });
    continue;
  }

  let worst = 0;
  let worstRole = "-";

  for (const [accent, role] of LEGACY_TO_ROLE) {
    const delta = deltaEOk(resolved.roles[role], tripletToOklch(legacy.palette[accent]));
    if (delta > worst) {
      worst = delta;
      worstRole = role;
    }
  }

  const brandDelta = deltaEOk(resolved.roles.brand, hexToOklch(legacy.siteThemeColor));
  if (brandDelta > worst) {
    worst = brandDelta;
    worstRole = "brand";
  }

  rows.push({ id, present: true, maxDeltaEOk: worst, schemaOk, worstRole, propertyCount });
}

const compared = rows.filter((row) => row.present);
const over = compared.filter((row) => row.maxDeltaEOk > TOLERANCE);
const schemaFailures = rows.filter((row) => !row.schemaOk);

console.log("=== theme property equivalence (X4 §4.2, T9 C6) ===");
console.log(`registry themes    : ${rows.length}`);
console.log(`compared to v10    : ${compared.length}`);
console.log(`no v10 counterpart : ${rows.length - compared.length}`);
console.log(`tolerance          : ΔE_OK ≤ ${TOLERANCE}`);
console.log(`over tolerance     : ${over.length}`);
console.log(`schema failures    : ${schemaFailures.length}`);
console.log();

const worstFirst = [...compared].sort((a, b) => b.maxDeltaEOk - a.maxDeltaEOk);
console.log("worst 12 by ΔE_OK against the v10 palette:");
for (const row of worstFirst.slice(0, 12)) {
  console.log(
    `  ${row.id.padEnd(20)} ${row.maxDeltaEOk.toFixed(6)}  worst=${row.worstRole.padEnd(10)} props=${row.propertyCount}`,
  );
}
console.log();

const propertyCounts = rows.map((row) => row.propertyCount);
console.log(
  `properties per theme: min ${Math.min(...propertyCounts)}, max ${Math.max(...propertyCounts)}`,
);

if (missingLegacy.length > 0) {
  console.log();
  console.log(`could not import ${missingLegacy.length} legacy config(s): ${missingLegacy.join(", ")}`);
}

if (over.length > 0) {
  console.log();
  console.log("OVER TOLERANCE:");
  for (const row of over) {
    console.log(`  ${row.id}: ${row.maxDeltaEOk.toFixed(6)} at ${row.worstRole}`);
  }
}

if (schemaFailures.length > 0) {
  console.log();
  console.log("SCHEMA FAILURES:");
  for (const row of schemaFailures) console.log(`  ${row.id}`);
}

const ok = over.length === 0 && schemaFailures.length === 0;
console.log();
console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
