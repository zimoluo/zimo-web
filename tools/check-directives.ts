import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve as resolvePath } from "node:path";

const ROOT = resolvePath(import.meta.dirname, "..");

const SCAN_ROOTS = ["src", "components", "lib"];

const DIRECTIVES = new Set(['"use client";', "'use client';", '"use server";', "'use server';"]);

export type Finding = {
  readonly file: string;
  readonly line: number;
  readonly directive: string;
  readonly before: string;
};

const isIgnorable = (line: string): boolean => {
  const trimmed = line.trim();
  return (
    trimmed === "" ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("#!")
  );
};

export function misplacedDirective(file: string, source: string): Finding | null {
  const lines = source.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] as string;
    const trimmed = line.trim();

    if (DIRECTIVES.has(trimmed)) {
      const before = lines.slice(0, index).find((earlier) => !isIgnorable(earlier));
      return before === undefined
        ? null
        : { file, line: index + 1, directive: trimmed, before: before.trim() };
    }

    if (!isIgnorable(line)) return null;
  }

  return null;
}

function collect(directory: string, files: string[]): void {
  let entries: string[];

  try {
    entries = readdirSync(directory);
  } catch {
    return;
  }

  entries.sort();

  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const path = join(directory, name);
    if (statSync(path).isDirectory()) collect(path, files);
    else if (name.endsWith(".ts") || name.endsWith(".tsx")) files.push(path);
  }
}

function main(): number {
  const files: string[] = [];
  for (const root of SCAN_ROOTS) collect(join(ROOT, root), files);

  const findings: Finding[] = [];

  for (const path of files) {
    const finding = misplacedDirective(
      relative(ROOT, path),
      readFileSync(path, "utf8"),
    );
    if (finding !== null) findings.push(finding);
  }

  console.log(`=== directive placement: ${files.length} file(s) scanned`);

  if (findings.length === 0) {
    console.log('every "use client" and "use server" is the first statement.');
    return 0;
  }

  for (const finding of findings) {
    console.error(
      `${finding.file}:${finding.line} ${finding.directive} comes after: ${finding.before}`,
    );
  }

  console.error(
    `\n${findings.length} misplaced directive(s). A directive after any expression is ignored by ` +
      `the bundler, and Next 16 fails the build on it.`,
  );

  return 1;
}

if (process.argv[1]?.endsWith("check-directives.ts") === true) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 2;
  }
}
