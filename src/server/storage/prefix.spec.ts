import { afterEach, describe, expect, it, vi } from "vitest";
import { createObjectStore, remoteStoragePrefix } from "./object";

afterEach(() => vi.unstubAllEnvs());

describe("versioned bucket namespace", () => {
  it("defaults remote deployments to v11 and permits an explicit operational override", () => {
    vi.stubEnv("ZIMO_WEB_STORAGE_PREFIX", undefined);
    expect(remoteStoragePrefix()).toBe("v11/");
    vi.stubEnv("ZIMO_WEB_STORAGE_PREFIX", "scratch/rehearsal/");
    expect(remoteStoragePrefix()).toBe("scratch/rehearsal/");
  });

  it("keeps reads, conditional writes, deletions, and paginated listing inside one namespace", async () => {
    const calls: Record<string, unknown>[] = [];
    const responses = [
      { Body: (async function* () { yield Buffer.from("{}"); })(), ETag: '"before"' },
      { ETag: '"after"' },
      {},
      { Contents: [{ Key: "v11/blog/documents/a.md", Size: 2 }, { Key: "blog/documents/legacy.md" }], NextContinuationToken: "next" },
      { Contents: [{ Key: "v11/blog/documents/b.md", Size: 3 }] },
    ];
    const store = createObjectStore({ send: async (command) => {
      calls.push((command as { input: Record<string, unknown> }).input);
      return responses.shift();
    } }, "v11/");
    expect(await store.readText("projects/entries/a.json")).toEqual({ value: "{}", etag: "before" });
    await store.writeText("projects/entries/a.json", "{}", { ifMatch: "before" });
    await store.remove("projects/entries/a.json");
    expect((await store.list("blog/documents/")).map((ref) => ref.key)).toEqual(["blog/documents/a.md", "blog/documents/b.md"]);
    expect(calls.slice(0, 3).map((call) => call.Key)).toEqual(Array(3).fill("v11/projects/entries/a.json"));
    expect(calls[1]).toMatchObject({ IfMatch: "before", ContentEncoding: "gzip" });
    expect(calls.slice(3).map((call) => call.Prefix)).toEqual(Array(2).fill("v11/blog/documents/"));
    expect(calls[4]?.ContinuationToken).toBe("next");
  });

  it.each(["v11", "../", "/v11/", "v11/../", "v11//", "v11?/"])("rejects an ambiguous namespace %s", (prefix) => {
    expect(() => createObjectStore({ send: async () => ({}) }, prefix)).toThrow("Storage prefix");
  });
});
