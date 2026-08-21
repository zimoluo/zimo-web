import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve as resolvePath } from "node:path";
import { transform } from "lightningcss";

const ROOT = resolvePath(import.meta.dirname, "..");
const SCAN_ROOTS = ["app", "components", "lib", "styles", "src"];

const collect = (entry, out) => {
  let info;
  try {
    info = statSync(entry);
  } catch {
    return;
  }
  if (info.isDirectory()) {
    for (const child of readdirSync(entry)) {
      if (child === "node_modules" || child.startsWith(".")) continue;
      collect(join(entry, child), out);
    }
    return;
  }
  if (entry.endsWith(".css")) out.push(entry);
};

const files = [];
for (const root of SCAN_ROOTS) collect(join(ROOT, root), files);

const TAILWIND_AT_RULES = /@(tailwind|apply|utility|theme|source|custom-variant|reference|slot|plugin|config|variant)\b/;

let checked = 0;
let skipped = 0;
const failures = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  if (TAILWIND_AT_RULES.test(source)) {
    skipped += 1;
    continue;
  }
  try {
    transform({
      filename: relative(ROOT, file),
      code: Buffer.from(source, "utf8"),
      minify: false,
      errorRecovery: false,
    });
    checked += 1;
  } catch (error) {
    failures.push({ file: relative(ROOT, file), message: error.message });
  }
}

console.log("=== css syntax check (lightningcss) ===");
console.log(`parsed        : ${checked}`);
console.log(`skipped       : ${skipped} (contain Tailwind at-rules)`);
console.log(`failed        : ${failures.length}`);

if (failures.length > 0) {
  console.log();
  for (const failure of failures) {
    console.log(`${failure.file}`);
    console.log(`  ${failure.message.split("\n")[0]}`);
  }
  process.exit(1);
}
