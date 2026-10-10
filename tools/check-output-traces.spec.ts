import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { inspectOutputTraces, privateTraceReason } from "./check-output-traces";

const roots: string[] = [];
const setup = () => {
  const root = mkdtempSync(join(tmpdir(), "zimo-output-traces-"));
  roots.push(root);
  const directory = join(root, ".next/server/app/api/v1/session");
  mkdirSync(directory, { recursive: true });
  const trace = join(directory, "route.js.nft.json");
  const write = (value: unknown) => writeFileSync(trace, JSON.stringify(value));
  const ref = (file: string) => relative(directory, join(root, file));
  return { root, directory, trace, write, ref };
};
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

describe("production output trace privacy", () => {
  it("rejects local content, review captures, coverage, Git metadata and environment files", () => {
    const { root, write, ref } = setup();
    write({ files: ["work/screenshots/private.png", ".local-storage/users/session.json", "coverage/result.json", ".git", ".git/config", ".env.local", "config/.env.production"].map(ref) });
    const result = inspectOutputTraces(root);
    expect(result.traces).toBe(1);
    expect(result.references).toBe(7);
    expect(result.violations).toHaveLength(7);
  });

  it("accepts production dependencies and excludes the separate dev/cache trees", () => {
    const { root, write, ref } = setup();
    write({ files: ["node_modules/sharp/package.json", "src/features/theme/registry/themes/velvet.ts", "public/favicon.ico"].map(ref) });
    for (const folder of ["dev", "cache"]) {
      mkdirSync(join(root, ".next", folder), { recursive: true });
      writeFileSync(join(root, ".next", folder, "ignored.nft.json"), "malformed");
    }
    expect(inspectOutputTraces(root)).toEqual({ traces: 1, references: 3, violations: [] });
  });

  it("normalizes traversal before checking private roots", () => {
    const { root, directory, write } = setup();
    write({ files: [`${relative(directory, root)}/public/../work/private.txt`] });
    expect(inspectOutputTraces(root).violations[0]?.file).toBe("work/private.txt");
    expect(privateTraceReason(root, join(root, "workshop/assets.json"))).toBeNull();
  });

  it("checks actual symlink targets and declared Turbopack symlink metadata", () => {
    const { root, write, ref } = setup();
    mkdirSync(join(root, "work"));
    writeFileSync(join(root, "work/private.json"), "{}");
    symlinkSync(join(root, "work/private.json"), join(root, "runtime.json"));
    write({ files: [ref("runtime.json")], symlinks: { "0": relative(root, join(root, "work/private.json")) } });
    const report = inspectOutputTraces(root);
    expect(report.violations.map((violation) => violation.reason)).toEqual(["symlink targets local-only project directory", "local-only project directory"]);
  });

  it("checks additional trace roots against the project privacy boundary", () => {
    const { root, directory, write } = setup();
    write({ files: [], additionalRoots: [{ name: "extra", path: relative(directory, root), files: [".local-storage/entry.json"] }] });
    expect(inspectOutputTraces(root).violations[0]?.file).toBe(".local-storage/entry.json");
  });

  it("rejects sibling repository content referenced directly, through symlinks or additional roots", () => {
    const { root, directory, write, ref } = setup();
    const sibling = mkdtempSync(join(tmpdir(), "zimo-sibling-content-"));
    roots.push(sibling);
    const content = join(sibling, "private.json");
    writeFileSync(content, "{}");
    symlinkSync(content, join(root, "sibling.json"));
    write({ files: [relative(directory, content), ref("sibling.json")], additionalRoots: [{ path: relative(directory, sibling), files: ["private.json"] }] });
    const report = inspectOutputTraces(root);
    expect(report.violations.map((violation) => violation.reason)).toEqual(["outside application trace root", "symlink targets outside application trace root", "outside application trace root"]);
  });

  it("fails closed for missing traces and malformed trace extensions", () => {
    const { root, write } = setup();
    expect(() => inspectOutputTraces(root)).toThrow("No production output traces");
    for (const value of [{files:[1]}, {files:[],symlinks:[]}, {files:[],symlinks:{"5":"work/private"}}, {files:[],additionalRoots:{}}, {files:[],additionalRoots:[{}]}]) {
      write(value);
      expect(() => inspectOutputTraces(root)).toThrow("Malformed");
    }
  });
});
