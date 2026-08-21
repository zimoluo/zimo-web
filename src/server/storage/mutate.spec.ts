import { describe, expect, it } from "vitest";
import { AppError } from "../../lib/errors";
import { FakeJsonStore } from "./fake-store";
import { BACKOFF_MS, isRetryableConflict, jitteredBackoff, mutateJson, readJson } from "./mutate";
import type { WriteCondition } from "./mutate";

type Comments = { readonly comments: readonly { readonly id: string }[] };

const validate = (input: unknown): Comments => {
  if (
    typeof input !== "object" ||
    input === null ||
    !Array.isArray((input as { comments?: unknown }).comments)
  ) {
    throw new Error("not a comment list");
  }
  return input as Comments;
};

const initial = (): Comments => ({ comments: [] });

const add = (id: string) => (current: Comments): Comments => ({
  comments: [...current.comments, { id }],
});

const noSleep = async (): Promise<void> => undefined;

describe("isRetryableConflict", () => {
  it("accepts all three precondition signals by name", () => {
    for (const name of [
      "PreconditionFailed",
      "ConditionalRequestConflict",
      "PreconditionRequired",
    ]) {
      expect(isRetryableConflict({ name }), name).toBe(true);
    }
  });

  it("accepts all three by status, including the 409 that is easy to miss", () => {
    for (const status of [412, 409, 428]) {
      expect(isRetryableConflict({ $metadata: { httpStatusCode: status } }), String(status)).toBe(
        true,
      );
    }
  });

  it("rejects anything else, so a real failure is not retried forever", () => {
    expect(isRetryableConflict({ name: "AccessDenied" })).toBe(false);
    expect(isRetryableConflict({ $metadata: { httpStatusCode: 500 } })).toBe(false);
    expect(isRetryableConflict(new Error("network"))).toBe(false);
    expect(isRetryableConflict(null)).toBe(false);
    expect(isRetryableConflict(undefined)).toBe(false);
    expect(isRetryableConflict("nope")).toBe(false);
  });
});

describe("jitteredBackoff", () => {
  it("returns the documented base delays at the midpoint", () => {
    expect(BACKOFF_MS.map((_, index) => jitteredBackoff(index, () => 0.5))).toEqual([
      25, 60, 140, 320,
    ]);
  });

  it("spreads plus or minus forty percent", () => {
    expect(jitteredBackoff(0, () => 0)).toBe(15);
    expect(jitteredBackoff(0, () => 1)).toBe(35);
  });

  it("holds the last delay for attempts beyond the table", () => {
    expect(jitteredBackoff(9, () => 0.5)).toBe(320);
  });
});

describe("readJson", () => {
  it("returns null for an absent object", async () => {
    const store = new FakeJsonStore();
    expect(await readJson(store, "missing", validate)).toBeNull();
  });

  it("validates on read and reports a bad stored object as upstream failure", async () => {
    const store = new FakeJsonStore();
    store.seed("k", { nope: true });

    await expect(readJson(store, "k", validate)).rejects.toThrow(AppError);
    await expect(readJson(store, "k", validate)).rejects.toThrow(/failed validation/);
  });

  it("returns the value with its etag", async () => {
    const store = new FakeJsonStore();
    store.seed("k", { comments: [] });

    const record = await readJson(store, "k", validate);
    expect(record?.value).toEqual({ comments: [] });
    expect(record?.etag).toBe("etag-1");
  });
});

describe("mutateJson", () => {
  it("creates the object with ifAbsent when it does not exist", async () => {
    const store = new FakeJsonStore();
    const result = await mutateJson(store, "k", validate, initial, add("c1"), {
      sleep: noSleep,
    });

    expect(result.comments).toEqual([{ id: "c1" }]);
    expect(store.writes[0]?.condition).toEqual({ ifAbsent: true });
  });

  it("compare-and-swaps with ifMatch when it does exist", async () => {
    const store = new FakeJsonStore();
    store.seed("k", { comments: [{ id: "c0" }] });

    await mutateJson(store, "k", validate, initial, add("c1"), { sleep: noSleep });
    expect(store.writes[0]?.condition).toEqual({ ifMatch: "etag-1" });
    expect(store.peek("k")).toEqual({ comments: [{ id: "c0" }, { id: "c1" }] });
  });

  it("D4 C5: re-applies the update against the winner's state, losing nothing", async () => {
    const store = new FakeJsonStore();
    store.seed("k", { comments: [] });

    let interleaved = false;
    const racingStore = {
      readRaw: store.readRaw,
      writeRaw: async (key: string, value: unknown, condition: WriteCondition) => {
        if (!interleaved) {
          interleaved = true;
          store.interleave(key, { comments: [{ id: "from-b" }] });
        }
        return store.writeRaw(key, value, condition);
      },
    };

    const result = await mutateJson(racingStore, "k", validate, initial, add("from-a"), {
      sleep: noSleep,
    });

    expect(result.comments.map((entry) => entry.id)).toEqual(["from-b", "from-a"]);
  });

  it("survives five forced conflicts within its retry budget", async () => {
    const store = new FakeJsonStore({ failures: 4 });
    store.seed("k", { comments: [] });

    const result = await mutateJson(store, "k", validate, initial, add("c1"), {
      sleep: noSleep,
    });

    expect(result.comments).toEqual([{ id: "c1" }]);
    expect(store.writes).toHaveLength(5);
  });

  it("throws conflict once the budget is exhausted", async () => {
    const store = new FakeJsonStore({ failures: 99 });
    store.seed("k", { comments: [] });

    await expect(
      mutateJson(store, "k", validate, initial, add("c1"), { sleep: noSleep }),
    ).rejects.toThrow(AppError);

    const thrown: unknown = await mutateJson(store, "k", validate, initial, add("c1"), {
      sleep: noSleep,
    }).then(
      () => null,
      (error: unknown) => error,
    );

    expect(thrown).toBeInstanceOf(AppError);
    expect((thrown as AppError).code).toBe("conflict");
    expect((thrown as AppError).message).toMatch(/please retry/i);
  });

  it("retries a 409, which is the concurrent-write case gate S9 exercises", async () => {
    const store = new FakeJsonStore({
      failures: 1,
      failureName: "ConditionalRequestConflict",
      failureStatus: 409,
    });
    store.seed("k", { comments: [] });

    const result = await mutateJson(store, "k", validate, initial, add("c1"), {
      sleep: noSleep,
    });
    expect(result.comments).toEqual([{ id: "c1" }]);
  });

  it("does not retry a non-conflict error", async () => {
    const store = {
      readRaw: async () => null,
      writeRaw: async () => {
        throw Object.assign(new Error("denied"), {
          name: "AccessDenied",
          $metadata: { httpStatusCode: 403 },
        });
      },
    };

    await expect(
      mutateJson(store, "k", validate, initial, add("c1"), { sleep: noSleep }),
    ).rejects.toThrow(/denied/);
  });

  it("honors a custom attempt budget", async () => {
    const store = new FakeJsonStore({ failures: 99 });
    store.seed("k", { comments: [] });

    await mutateJson(store, "k", validate, initial, add("c1"), {
      attempts: 2,
      sleep: noSleep,
    }).catch(() => undefined);

    expect(store.writes).toHaveLength(2);
  });

  it("never sleeps after the final attempt", async () => {
    const store = new FakeJsonStore({ failures: 99 });
    store.seed("k", { comments: [] });

    const delays: number[] = [];
    await mutateJson(store, "k", validate, initial, add("c1"), {
      attempts: 3,
      sleep: async (ms) => {
        delays.push(ms);
      },
    }).catch(() => undefined);

    expect(delays).toHaveLength(2);
  });

  it("treats a floor of one attempt as one attempt", async () => {
    const store = new FakeJsonStore({ failures: 99 });
    store.seed("k", { comments: [] });

    await mutateJson(store, "k", validate, initial, add("c1"), {
      attempts: 0,
      sleep: noSleep,
    }).catch(() => undefined);

    expect(store.writes).toHaveLength(1);
  });

  it("D4 §3.2: twenty sequential mutations against one key lose nothing", async () => {
    const store = new FakeJsonStore();

    for (let index = 0; index < 20; index += 1) {
      await mutateJson(store, "k", validate, initial, add(`c${index}`), { sleep: noSleep });
    }

    const final = validate(store.peek("k"));
    expect(final.comments).toHaveLength(20);
    expect(new Set(final.comments.map((entry) => entry.id)).size).toBe(20);
  });

  it("D4 §4.4: update is called with current state and its result is what lands", async () => {
    const store = new FakeJsonStore();
    store.seed("k", { comments: [{ id: "existing" }] });

    const seen: Comments[] = [];
    await mutateJson(
      store,
      "k",
      validate,
      initial,
      (current) => {
        seen.push(current);
        return add("new")(current);
      },
      { sleep: noSleep },
    );

    expect(seen).toHaveLength(1);
    expect(seen[0]?.comments).toEqual([{ id: "existing" }]);
  });

  it("keeps a caller-generated id stable across retries, so a retry is not a new comment", async () => {
    const store = new FakeJsonStore({ failures: 2 });
    store.seed("k", { comments: [] });

    const generatedOnce = "fixed-id";
    const result = await mutateJson(store, "k", validate, initial, add(generatedOnce), {
      sleep: noSleep,
    });

    expect(result.comments).toEqual([{ id: generatedOnce }]);
    expect(store.writes).toHaveLength(3);
  });
});

describe("default sleep and jitter", () => {
  it("uses a real delay and the midpoint jitter when neither is injected", async () => {
    const store = new FakeJsonStore({ failures: 1 });
    store.seed("k", { comments: [] });

    const started = process.hrtime.bigint();
    const result = await mutateJson(store, "k", validate, initial, add("c1"));
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1_000_000;

    expect(result.comments).toEqual([{ id: "c1" }]);
    expect(store.writes).toHaveLength(2);
    expect(elapsedMs).toBeGreaterThanOrEqual(10);
  });
});
