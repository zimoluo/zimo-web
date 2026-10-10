import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

export type TraceViolation = { readonly trace: string; readonly file: string; readonly reason: string };
export type TraceReport = { readonly traces: number; readonly references: number; readonly violations: readonly TraceViolation[] };

const privateDirectories = new Set(["work", ".local-storage", "coverage", ".git"]);
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

export function privateTraceReason(projectRoot: string, file: string): string | null {
  const fromRoot = relative(projectRoot, file).split(sep);
  if (fromRoot[0] === "..") return "outside application trace root";
  if (privateDirectories.has(fromRoot[0] ?? "")) return "local-only project directory";
  if (fromRoot.some((segment) => segment.startsWith(".env"))) return "environment file";
  return null;
}

export function inspectOutputTraces(projectPath: string, outputPath = ".next"): TraceReport {
  const projectRoot = realpathSync(resolve(projectPath));
  const outputRoot = resolve(projectRoot, outputPath);
  const traceFiles: string[] = [];
  const violations: TraceViolation[] = [];
  let references = 0;
  const collect = (directory: string, top = false): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (top && (entry.name === "dev" || entry.name === "cache")) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) collect(path);
      else if (entry.isFile() && entry.name.endsWith(".nft.json")) traceFiles.push(path);
    }
  };
  collect(outputRoot, true);
  if (traceFiles.length === 0) throw new Error("No production output traces found; build the application first");
  for (const trace of traceFiles.sort()) {
    const content: unknown = JSON.parse(readFileSync(trace, "utf8"));
    const traceName = relative(projectRoot, trace);
    const checkFile = (base: string, entry: string): void => {
      references += 1;
      const path = resolve(base, entry);
      const reason = privateTraceReason(projectRoot, path);
      if (reason !== null) violations.push({ trace: traceName, file: relative(projectRoot, path), reason });
      if (existsSync(path)) {
        const target = realpathSync(path);
        const targetReason = privateTraceReason(projectRoot, target);
        if (target !== path && targetReason !== null) violations.push({ trace: traceName, file: relative(projectRoot, target), reason: `symlink targets ${targetReason}` });
      }
    };
    const checkGroup = (value: unknown, base: string): void => {
      if (!isRecord(value) || !Array.isArray(value.files) || value.files.some((entry) => typeof entry !== "string")) throw new Error(`Malformed file list in ${traceName}`);
      for (const entry of value.files as string[]) checkFile(base, entry);
      if (value.symlinks !== undefined) {
        if (!isRecord(value.symlinks)) throw new Error(`Malformed symlink list in ${traceName}`);
        for (const [index, target] of Object.entries(value.symlinks)) {
          const entry = value.files[Number(index)] as unknown;
          if (typeof entry !== "string" || typeof target !== "string") throw new Error(`Malformed symlink target in ${traceName}`);
          checkFile(dirname(resolve(base, entry)), target);
        }
      }
    };
    checkGroup(content, dirname(trace));
    if (isRecord(content) && content.additionalRoots !== undefined) {
      if (!Array.isArray(content.additionalRoots)) throw new Error(`Malformed additional trace roots in ${traceName}`);
      for (const extra of content.additionalRoots) {
        if (!isRecord(extra) || typeof extra.path !== "string") throw new Error(`Malformed additional trace root in ${traceName}`);
        checkGroup(extra, resolve(dirname(trace), extra.path));
      }
    }
  }
  return { traces: traceFiles.length, references, violations };
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = inspectOutputTraces(process.cwd(), process.argv[2] ?? ".next");
    console.log(JSON.stringify(report, null, 2));
    if (report.violations.length > 0) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
