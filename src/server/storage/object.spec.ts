import { describe, expect, it } from "vitest";
import { AppError } from "../../lib/errors";
import { collect, compress, decompress, looksGzipped } from "./codec";
import {
  DATA_SECTIONS,
  DOCUMENT_SECTIONS,
  encodeSub,
  entryFormat,
  isDocumentSection,
  keys,
  MUTABLE_PREFIXES,
  slugFromKey,
} from "./keys";
import { createObjectStore } from "./object";
import type { Sender } from "./object";
import { mutateJson } from "./mutate";
import { SECTIONS } from "../../features/entries/model/types";

type Call = { name: string; input: Record<string, unknown> };

const recorder = (
  respond: (call: Call, index: number) => unknown,
): { sender: Sender; calls: Call[] } => {
  const calls: Call[] = [];

  return {
    calls,
    sender: {
      send: async (command) => {
        const shaped = command as {
          constructor: { name: string };
          input: Record<string, unknown>;
        };
        const call = { name: shaped.constructor.name, input: shaped.input };
        calls.push(call);
        const result = respond(call, calls.length - 1);
        if (result instanceof Error) throw result;
        return result;
      },
    },
  };
};

const bodyOf = (call: Call): string =>
  decompress(call.input.Body as Uint8Array);

const gzipped = (value: unknown): AsyncIterable<Uint8Array> => {
  const buffer = compress(JSON.stringify(value));
  return (async function* stream() {
    yield new Uint8Array(buffer.subarray(0, 5));
    yield new Uint8Array(buffer.subarray(5));
  })();
};

const plain = (value: unknown): AsyncIterable<Uint8Array> => {
  const buffer = Buffer.from(JSON.stringify(value), "utf8");
  return (async function* stream() {
    yield new Uint8Array(buffer);
  })();
};

const absent = (): Error =>
  Object.assign(new Error("The specified key does not exist."), {
    name: "NoSuchKey",
    $metadata: { httpStatusCode: 404 },
  });

describe("D4 C3: one module owns every key", () => {
  it("names the v11 layout, not the v10 one", () => {
    expect(keys.entryDocument("blog", "on-gradients")).toBe(
      "blog/documents/on-gradients.md",
    );
    expect(keys.entryDocument("management", "privacy")).toBe(
      "management/documents/privacy.md",
    );
    expect(keys.entryData("album", "kyoto")).toBe("album/entries/kyoto.json");
    expect(keys.reactions("blog", "x")).toBe("blog/reactions/x.json");
    expect(keys.homeMessages()).toBe("home/messages.json");
    expect(keys.treeMessages()).toBe("special/christmas/tree.json");
  });

  it("routes each section to the right storage shape", () => {
    expect(keys.entry("blog", "x")).toBe("blog/documents/x.md");
    expect(keys.entry("projects", "x")).toBe("projects/entries/x.json");
    expect(SECTIONS.map(entryFormat)).toEqual(["md", "json", "json", "md"]);
    expect(DOCUMENT_SECTIONS.every(isDocumentSection)).toBe(true);
    expect(DATA_SECTIONS.some(isDocumentSection)).toBe(false);
  });

  it("refuses to build a key from an unvalidated slug", () => {
    expect(() => keys.entry("blog", "../../etc/passwd")).toThrow();
    expect(() => keys.commentThread("blog", "a/b")).toThrow();
    expect(() => keys.reactions("album", "")).toThrow();
  });

  it("percent-encodes the OAuth subject, because a provider is not a validator", () => {
    expect(keys.user("1234567890")).toBe("account/users/1234567890.json");
    expect(keys.user("apple_abc")).toBe("account/users/apple_abc.json");
    expect(keys.user("../../etc/passwd")).toBe(
      "account/users/..%2F..%2Fetc%2Fpasswd.json",
    );
    expect(encodeSub("a b")).toBe("a%20b");
  });

  it("recovers a slug from an entry key and rejects a foreign one", () => {
    expect(slugFromKey("blog", "blog/documents/on-gradients.md")).toBe(
      "on-gradients",
    );
    expect(slugFromKey("blog", "blog/documents/nested/deep.md")).toBeNull();
    expect(slugFromKey("album", "album/entries/kyoto.md")).toBeNull();
    expect(slugFromKey("blog", "blog/index.json")).toBeNull();
  });

  it("lists the mutable prefixes a backup has to cover", () => {
    for (const section of SECTIONS) {
      expect(MUTABLE_PREFIXES).toContain(`${section}/comments/`);
      expect(MUTABLE_PREFIXES).toContain(`${section}/reactions/`);
    }
    expect(MUTABLE_PREFIXES).toContain("account/users/");
  });
});

describe("D4 C2: one gunzip implementation", () => {
  it("round-trips through gzip", () => {
    const text = "a".repeat(5_000);
    const packed = compress(text);
    expect(looksGzipped(packed)).toBe(true);
    expect(packed.byteLength).toBeLessThan(text.length);
    expect(decompress(packed)).toBe(text);
  });

  it("reads a plain object too, because the bucket holds a mixture", () => {
    const raw = Buffer.from('{"a":1}', "utf8");
    expect(looksGzipped(raw)).toBe(false);
    expect(decompress(raw)).toBe('{"a":1}');
  });

  it("joins chunks without quadratic string concatenation", async () => {
    const chunks = (async function* stream() {
      yield new Uint8Array([104, 105]);
      yield new Uint8Array([33]);
    })();
    expect(decompress(await collect(chunks))).toBe("hi!");
  });

  it("treats a missing body as empty rather than throwing", async () => {
    expect((await collect(undefined)).byteLength).toBe(0);
    expect((await collect(null)).byteLength).toBe(0);
  });

  it("survives a gzip stream split across the magic bytes", async () => {
    const store = createObjectStore(
      recorder(() => ({ Body: gzipped({ ok: true }), ETag: '"abc"' })).sender,
    );
    await expect(store.readJson("k", (input) => input)).resolves.toEqual({
      value: { ok: true },
      etag: "abc",
    });
  });
});

describe("D4 §2: the object layer", () => {
  it("returns null for an absent object rather than throwing", async () => {
    const store = createObjectStore(recorder(() => absent()).sender);
    await expect(store.readText("missing")).resolves.toBeNull();
    await expect(store.readJson("missing", (input) => input)).resolves.toBeNull();
  });

  it("turns any other read failure into upstream-failure, with the key in detail", async () => {
    const store = createObjectStore(
      recorder(() =>
        Object.assign(new Error("connection reset"), {
          name: "NetworkingError",
          $metadata: { httpStatusCode: 0 },
        }),
      ).sender,
    );

    await expect(store.readText("blog/comments/x.json")).rejects.toMatchObject({
      code: "upstream-failure",
      detail: "blog/comments/x.json",
    });
  });

  it("D4 C9: a malformed object is upstream-failure, not a crash in a component", async () => {
    const broken = (async function* stream() {
      yield new Uint8Array(Buffer.from("{ not json", "utf8"));
    })();
    const store = createObjectStore(
      recorder(() => ({ Body: broken, ETag: '"e"' })).sender,
    );

    await expect(store.readJson("k", (input) => input)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it("D4 C9: a schema failure is upstream-failure too", async () => {
    const store = createObjectStore(
      recorder(() => ({ Body: plain({ wrong: true }), ETag: '"e"' })).sender,
    );

    await expect(
      store.readJson("k", () => {
        throw new Error("schema mismatch");
      }),
    ).rejects.toMatchObject({ code: "upstream-failure" });
  });

  it("strips the quotes S3 puts around an ETag, so it can be compared", async () => {
    const store = createObjectStore(
      recorder(() => ({ Body: plain({}), ETag: '"d41d8cd9"' })).sender,
    );
    await expect(store.readText("k")).resolves.toMatchObject({ etag: "d41d8cd9" });
  });

  it("D4 §5: sets ContentType as well as ContentEncoding", async () => {
    const { sender, calls } = recorder(() => ({ ETag: '"new"' }));
    const store = createObjectStore(sender);

    await store.writeJson("k", { a: 1 });

    expect(calls[0]?.name).toBe("PutObjectCommand");
    expect(calls[0]?.input.ContentType).toBe("application/json");
    expect(calls[0]?.input.ContentEncoding).toBe("gzip");
    expect(bodyOf(calls[0] as Call)).toBe('{"a":1}');
  });

  it("can write uncompressed, for an object a browser fetches directly", async () => {
    const { sender, calls } = recorder(() => ({ ETag: '"new"' }));
    const store = createObjectStore(sender);

    await store.writeText("feed.rss", "<rss/>", {
      gzip: false,
      contentType: "application/rss+xml",
    });

    expect(calls[0]?.input.ContentEncoding).toBeUndefined();
    expect(calls[0]?.input.ContentType).toBe("application/rss+xml");
  });

  it("sends IfMatch for a compare-and-swap and IfNoneMatch for a create", async () => {
    const { sender, calls } = recorder(() => ({ ETag: '"new"' }));
    const store = createObjectStore(sender);

    await store.writeJson("k", {}, { ifMatch: "abc" });
    await store.writeJson("k", {}, { ifAbsent: true });

    expect(calls[0]?.input.IfMatch).toBe("abc");
    expect(calls[0]?.input.IfNoneMatch).toBeUndefined();
    expect(calls[1]?.input.IfNoneMatch).toBe("*");
    expect(calls[1]?.input.IfMatch).toBeUndefined();
  });

  it("sends no condition at all for an unconditional write", async () => {
    const { sender, calls } = recorder(() => ({ ETag: '"new"' }));
    await createObjectStore(sender).writeJson("k", {});
    expect(calls[0]?.input.IfMatch).toBeUndefined();
    expect(calls[0]?.input.IfNoneMatch).toBeUndefined();
  });

  it("pages through a listing rather than stopping at the first 1000 objects", async () => {
    const { sender, calls } = recorder((_call, index) =>
      index === 0
        ? {
            Contents: [{ Key: "blog/documents/a.md", Size: 1, LastModified: new Date(0) }],
            NextContinuationToken: "next",
          }
        : {
            Contents: [{ Key: "blog/documents/b.md", Size: 2, LastModified: new Date(0) }],
          },
    );

    const refs = await createObjectStore(sender).list("blog/documents/");

    expect(refs.map((ref) => ref.key)).toEqual([
      "blog/documents/a.md",
      "blog/documents/b.md",
    ]);
    expect(calls[1]?.input.ContinuationToken).toBe("next");
  });

  it("skips a listing entry with no key", async () => {
    const { sender } = recorder(() => ({ Contents: [{ Size: 1 }] }));
    await expect(createObjectStore(sender).list("x/")).resolves.toEqual([]);
  });

  it("deletes by key", async () => {
    const { sender, calls } = recorder(() => ({}));
    await createObjectStore(sender).remove("blog/comments/x.json");
    expect(calls[0]?.name).toBe("DeleteObjectCommand");
    expect(calls[0]?.input.Key).toBe("blog/comments/x.json");
  });
});

describe("D4 §3: the object layer drives mutateJson", () => {
  it("creates with IfNoneMatch then swaps with IfMatch", async () => {
    let stored: { body: string; etag: string } | null = null;

    const { sender, calls } = recorder((call) => {
      if (call.name === "GetObjectCommand") {
        if (stored === null) return absent();
        const body = stored.body;
        return {
          ETag: `"${stored.etag}"`,
          Body: (async function* stream() {
            yield new Uint8Array(Buffer.from(body, "utf8"));
          })(),
        };
      }
      stored = { body: decompress(call.input.Body as Uint8Array), etag: "v1" };
      return { ETag: '"v1"' };
    });

    const store = createObjectStore(sender);

    const created = await mutateJson(
      store.asJsonStore(),
      "blog/comments/x.json",
      (input) => input as { comments: string[] },
      () => ({ comments: [] }),
      (current) => ({ comments: [...current.comments, "a"] }),
    );

    expect(created).toEqual({ comments: ["a"] });
    expect(calls[1]?.input.IfNoneMatch).toBe("*");

    const appended = await mutateJson(
      store.asJsonStore(),
      "blog/comments/x.json",
      (input) => input as { comments: string[] },
      () => ({ comments: [] }),
      (current) => ({ comments: [...current.comments, "b"] }),
    );

    expect(appended).toEqual({ comments: ["a", "b"] });
    expect(calls[3]?.input.IfMatch).toBe("v1");
  });

  it("reports invalid stored JSON as upstream-failure through the store seam", async () => {
    const { sender } = recorder(() => ({
      ETag: '"e"',
      Body: (async function* stream() {
        yield new Uint8Array(Buffer.from("<html>error</html>", "utf8"));
      })(),
    }));

    await expect(
      mutateJson(
        createObjectStore(sender).asJsonStore(),
        "k",
        (input) => input,
        () => ({}),
        (current) => current,
      ),
    ).rejects.toMatchObject({ code: "upstream-failure" });
  });
});
