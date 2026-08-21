import { afterEach, describe, expect, it, vi } from "vitest";
import { AppError, ERROR_CODES, ERROR_STATUS, isClientError, statusFor, toProblem } from "../../lib/errors";
import type { ErrorCode } from "../../lib/errors";
import {
  handler,
  json,
  noContent,
  PROBLEM_CONTENT_TYPE,
  problemFor,
  problemResponse,
  resetProblemEnvironment,
  setProblemEnvironment,
} from "./problem";
import { corsFor, corsForRequest, isAllowedOrigin, preflight } from "./cors";
import {
  BURST_WRITES,
  clientIp,
  createLimiter,
  SUSTAINED_WRITES,
  WRITE_POLICIES,
} from "./rate-limit";
import {
  DEFAULT_LIMIT,
  formatCursor,
  MAX_LIMIT,
  paginate,
  parseCursor,
  parseFields,
  parseLimit,
  parseListQuery,
  project,
  SUMMARY_FIELDS,
} from "./query";
import {
  rejectLegacyParams,
  requireEntryParams,
  requireSection,
  requireSlugParam,
} from "./params";
import { resolveAuthor } from "../../features/entries/authors";
import type { Slug } from "../../features/entries/model/ids";
import type { EntrySummary } from "../../features/entries/model/types";

afterEach(resetProblemEnvironment);

const summary = (
  slug: string,
  publishedAt: string,
  overrides: Partial<EntrySummary> = {},
): EntrySummary => ({
  section: "blog",
  slug: slug as Slug,
  title: slug,
  publishedAt,
  unlisted: false,
  tags: [],
  authors: [resolveAuthor("zimo")],
  ...overrides,
});

describe("D3 C4: every error maps to problem+json with the right status", () => {
  const expected: Readonly<Record<ErrorCode, number>> = {
    "invalid-request": 400,
    unauthenticated: 401,
    forbidden: 403,
    "not-found": 404,
    conflict: 409,
    "precondition-failed": 412,
    "payload-too-large": 413,
    unprocessable: 422,
    "rate-limited": 429,
    "upstream-failure": 502,
    internal: 500,
  };

  it("covers the D3 §5 table exactly, with no code left unmapped", () => {
    expect(ERROR_STATUS).toEqual(expected);
    expect(ERROR_CODES).toHaveLength(Object.keys(expected).length);
  });

  it.each(ERROR_CODES)("responds to %s with its status and content type", async (code) => {
    setProblemEnvironment({ correlationId: () => "fixed-id", log: () => {} });
    const response = problemResponse(new AppError(code, "a message"));

    expect(response.status).toBe(statusFor(code));
    expect(response.headers.get("content-type")).toBe(PROBLEM_CONTENT_TYPE);

    const body = (await response.json()) as Record<string, unknown>;
    expect(body.type).toBe(`https://zimoluo.me/problems/${code}`);
    expect(body.status).toBe(statusFor(code));
    expect(typeof body.title).toBe("string");
  });

  it("returns detail for client errors and withholds it for server errors", () => {
    setProblemEnvironment({ correlationId: () => "fixed-id", log: () => {} });

    expect(problemFor(new AppError("unprocessable", "Comments are limited to 3000 characters.")).detail).toBe(
      "Comments are limited to 3000 characters.",
    );
    expect(problemFor(new AppError("internal", "s3://bucket/blog/secret.json missing")).detail).toBeUndefined();
    expect(problemFor(new AppError("upstream-failure", "connect ECONNREFUSED")).detail).toBeUndefined();
  });

  it("D3 C5: an unknown throw leaks nothing, and is logged with a correlation id", () => {
    const log = vi.fn();
    setProblemEnvironment({ correlationId: () => "corr-1", log });

    const problem = problemFor(new Error("PutObject failed for key blog/comments/x.json"));

    expect(problem.status).toBe(500);
    expect(problem.detail).toBeUndefined();
    expect(problem.correlationId).toBe("corr-1");
    expect(JSON.stringify(problem)).not.toContain("blog/comments");
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0]?.[0]).toMatchObject({ correlationId: "corr-1", code: "internal" });
  });

  it("does not spend a correlation id on a client error", () => {
    const correlationId = vi.fn(() => "unused");
    setProblemEnvironment({ correlationId, log: () => {} });

    problemFor(new AppError("not-found", "no such entry"));

    expect(correlationId).not.toHaveBeenCalled();
  });

  it("D3 C10: a rate-limited problem carries Retry-After in seconds", () => {
    const response = problemResponse(
      new AppError("rate-limited", "slow down", { retryAfter: 42.3 }),
    );
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("43");
  });

  it("omits Retry-After for anything else", () => {
    expect(problemResponse(new AppError("forbidden", "no")).headers.get("retry-after")).toBeNull();
  });

  it("names the instance so a problem can be traced to a URL", () => {
    const problem = toProblem(new AppError("not-found", "no such entry"), {
      instance: "/api/v1/entries/blog/missing",
    });
    expect(problem.instance).toBe("/api/v1/entries/blog/missing");
  });

  it("classifies 4xx as client and 5xx as not", () => {
    expect(isClientError("unprocessable")).toBe(true);
    expect(isClientError("upstream-failure")).toBe(false);
  });
});

describe("D3 C3: one wrapper, so no route handler needs try/catch", () => {
  const request = new Request("https://zimoluo.me/api/v1/entries/blog/x");

  it("passes a successful response through untouched", async () => {
    const wrapped = handler(() => json({ ok: true }, { status: 201 }));
    const response = await wrapped(request, {});
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("turns a thrown AppError into its problem response", async () => {
    const wrapped = handler(() => {
      throw new AppError("not-found", "no such entry");
    });
    const response = await wrapped(request, {});
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(PROBLEM_CONTENT_TYPE);
    await expect(response.json()).resolves.toMatchObject({
      instance: "/api/v1/entries/blog/x",
    });
  });

  it("catches a rejected promise as well as a synchronous throw", async () => {
    setProblemEnvironment({ correlationId: () => "corr", log: () => {} });
    const wrapped = handler(async () => {
      await Promise.resolve();
      throw new AppError("upstream-failure", "s3 down");
    });
    expect((await wrapped(request, {})).status).toBe(502);
  });

  it("serves 204 with no body for an absent session", async () => {
    const response = noContent();
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
  });
});

describe("D3 C11: CORS", () => {
  it("allows the christmas tree origin only", () => {
    expect(corsFor("https://tree.zimoluo.me")["Access-Control-Allow-Origin"]).toBe(
      "https://tree.zimoluo.me",
    );
    expect(corsFor("https://evil.test")["Access-Control-Allow-Origin"]).toBeUndefined();
    expect(corsFor(null)["Access-Control-Allow-Origin"]).toBeUndefined();
  });

  it("sends Vary: Origin whether or not the origin is allowed", () => {
    expect(corsFor("https://tree.zimoluo.me").Vary).toBe("Origin");
    expect(corsFor("https://evil.test").Vary).toBe("Origin");
  });

  it("never sends Allow-Credentials", () => {
    for (const origin of ["https://tree.zimoluo.me", "https://evil.test", null]) {
      expect(Object.keys(corsFor(origin))).not.toContain(
        "Access-Control-Allow-Credentials",
      );
    }
  });

  it("does not reflect an arbitrary origin", () => {
    expect(isAllowedOrigin("https://tree.zimoluo.me.evil.test")).toBe(false);
    expect(isAllowedOrigin("http://tree.zimoluo.me")).toBe(false);
  });

  it("answers a preflight with 204 and the same headers", () => {
    const response = preflight(
      new Request("https://zimoluo.me/api/v1/tree-messages", {
        method: "OPTIONS",
        headers: { origin: "https://tree.zimoluo.me" },
      }),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-methods")).toBe("GET, POST, OPTIONS");
  });

  it("reads the origin off the request", () => {
    const request = new Request("https://zimoluo.me/api/v1/tree-messages", {
      headers: { origin: "https://tree.zimoluo.me" },
    });
    expect(corsForRequest(request)["Access-Control-Allow-Origin"]).toBe(
      "https://tree.zimoluo.me",
    );
  });
});

describe("D3 C10: rate limiting", () => {
  const at = { now: 0 };
  const limiter = () => createLimiter(WRITE_POLICIES, () => at.now);

  it("rejects the 11th write in 5 minutes", () => {
    at.now = 0;
    const bucket = limiter();

    for (let write = 1; write <= 10; write += 1) {
      at.now = write * 20_000;
      expect(bucket.take("sub-a").allowed).toBe(true);
    }

    at.now = 11 * 20_000;
    const denied = bucket.take("sub-a");
    expect(denied.allowed).toBe(false);
    if (!denied.allowed) {
      expect(denied.policy).toBe("sustained");
      expect(denied.retryAfterMs).toBeGreaterThan(0);
    }
  });

  it("limits a rapid burst to three, before the sustained bucket is anywhere near empty", () => {
    at.now = 0;
    const bucket = limiter();

    expect(bucket.take("sub-a").allowed).toBe(true);
    expect(bucket.take("sub-a").allowed).toBe(true);
    expect(bucket.take("sub-a").allowed).toBe(true);

    const denied = bucket.take("sub-a");
    expect(denied.allowed).toBe(false);
    if (!denied.allowed) expect(denied.policy).toBe("burst");
  });

  it("slides, so the allowance returns as the oldest write ages out", () => {
    at.now = 0;
    const bucket = limiter();
    for (let write = 0; write < 3; write += 1) bucket.take("sub-a");

    at.now = 29_999;
    expect(bucket.take("sub-a").allowed).toBe(false);
    at.now = 30_000;
    expect(bucket.take("sub-a").allowed).toBe(true);
  });

  it("keys per subject, so one user cannot exhaust another's allowance", () => {
    at.now = 0;
    const bucket = limiter();
    for (let write = 0; write < 3; write += 1) bucket.take("sub-a");

    expect(bucket.take("sub-a").allowed).toBe(false);
    expect(bucket.take("sub-b").allowed).toBe(true);
  });

  it("does not spend a token when merely checking", () => {
    at.now = 0;
    const bucket = limiter();
    for (let peek = 0; peek < 10; peek += 1) {
      expect(bucket.check("sub-a").allowed).toBe(true);
    }
    expect(bucket.take("sub-a").allowed).toBe(true);
  });

  it("counts only writes it allowed, so refused attempts do not deepen the hole", () => {
    at.now = 0;
    const bucket = limiter();
    for (let write = 0; write < 3; write += 1) bucket.take("sub-a");

    for (let attempt = 0; attempt < 20; attempt += 1) bucket.take("sub-a");

    at.now = 60_000;
    for (let write = 0; write < 3; write += 1) {
      expect(bucket.take("sub-a").allowed).toBe(true);
    }
  });

  it("throws a rate-limited AppError carrying retryAfter in seconds", () => {
    at.now = 0;
    const bucket = limiter();
    for (let write = 0; write < 3; write += 1) bucket.require("sub-a");

    try {
      bucket.require("sub-a");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("rate-limited");
      const detail = (error as AppError).detail as { retryAfter: number };
      expect(detail.retryAfter).toBeGreaterThan(0);
      expect(detail.retryAfter).toBeLessThanOrEqual(30);
    }
  });

  it("forgets idle subjects, so module state does not grow without bound", () => {
    at.now = 0;
    const bucket = limiter();
    bucket.take("sub-a");
    expect(bucket.size()).toBe(1);

    at.now = 5 * 60_000 + 1;
    bucket.take("sub-b");
    expect(bucket.size()).toBe(1);
  });

  it("resets one subject or all of them", () => {
    at.now = 0;
    const bucket = limiter();
    bucket.take("sub-a");
    bucket.take("sub-b");
    bucket.reset("sub-a");
    expect(bucket.size()).toBe(1);
    bucket.reset();
    expect(bucket.size()).toBe(0);
  });

  it("states both write policies, per D3 §7", () => {
    expect(SUSTAINED_WRITES.limit).toBe(10);
    expect(SUSTAINED_WRITES.windowMs).toBe(5 * 60_000);
    expect(BURST_WRITES.limit).toBe(3);
    expect(BURST_WRITES.windowMs).toBe(30_000);
  });

  it("keys the public tree endpoint by forwarded IP", () => {
    expect(
      clientIp(
        new Request("https://zimoluo.me/api/v1/tree-messages", {
          headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18" },
        }),
      ),
    ).toBe("203.0.113.7");
    expect(clientIp(new Request("https://zimoluo.me/api/v1/tree-messages"))).toBe("unknown");
  });
});

describe("D3 §2.1: pagination", () => {
  const entries = [
    summary("newest", "2026-03-01T00:00:00Z"),
    summary("middle", "2026-02-01T00:00:00Z"),
    summary("tied-a", "2026-01-01T00:00:00Z"),
    summary("tied-b", "2026-01-01T00:00:00Z"),
    summary("oldest", "2025-01-01T00:00:00Z"),
  ];

  it("defaults to 50 and caps at 200, where v10 returned everything unbounded", () => {
    expect(parseLimit(null)).toBe(DEFAULT_LIMIT);
    expect(parseLimit("")).toBe(DEFAULT_LIMIT);
    expect(parseLimit("200")).toBe(MAX_LIMIT);
    expect(() => parseLimit("201")).toThrow(AppError);
    expect(() => parseLimit("0")).toThrow(AppError);
    expect(() => parseLimit("-1")).toThrow(AppError);
    expect(() => parseLimit("ten")).toThrow(AppError);
    expect(() => parseLimit("1.5")).toThrow(AppError);
  });

  it("walks the list without repeating or skipping an entry", () => {
    const seen: string[] = [];
    let cursor = null as ReturnType<typeof parseCursor>;

    for (let page = 0; page < 5; page += 1) {
      const result = paginate(entries, 2, cursor);
      seen.push(...result.items.map((entry) => entry.slug as string));
      if (result.nextCursor === undefined) break;
      cursor = parseCursor(result.nextCursor);
    }

    expect(seen).toEqual(["newest", "middle", "tied-a", "tied-b", "oldest"]);
  });

  it("does not lose an entry that shares a publishedAt with the cursor", () => {
    const cursor = parseCursor("2026-01-01T00:00:00Z|tied-a");
    expect(paginate(entries, 10, cursor).items.map((entry) => entry.slug)).toEqual([
      "tied-b",
      "oldest",
    ]);
  });

  it("omits nextCursor on the last page", () => {
    expect(paginate(entries, 10, null).nextCursor).toBeUndefined();
    expect(paginate(entries, 5, null).nextCursor).toBeUndefined();
    expect(paginate(entries, 4, null).nextCursor).toBe("2026-01-01T00:00:00Z|tied-b");
  });

  it("formats a cursor as publishedAt|slug", () => {
    expect(formatCursor(entries[0] as EntrySummary)).toBe("2026-03-01T00:00:00Z|newest");
  });

  it("rejects a malformed cursor rather than silently starting over", () => {
    expect(parseCursor(null)).toBeNull();
    expect(parseCursor("")).toBeNull();
    expect(() => parseCursor("nonsense")).toThrow(AppError);
    expect(() => parseCursor("2026-03-01T00:00:00Z")).toThrow(AppError);
    expect(() => parseCursor("2026-03-01|newest")).toThrow(AppError);
    expect(() => parseCursor("2026-03-01T00:00:00Z|../etc")).toThrow(AppError);
  });

  it("handles an empty section", () => {
    expect(paginate([], 10, null)).toEqual({ items: [] });
  });
});

describe("D3 §2.1: sparse fieldsets", () => {
  const entry = summary("on-gradients", "2026-03-01T00:00:00Z", {
    description: "A study",
    tags: ["design"],
  });

  it("returns the full summary when no fields are asked for", () => {
    expect(parseFields(null)).toBeNull();
    expect(project(entry, null)).toBe(entry);
  });

  it("projects only the requested fields, plus the identifying two", () => {
    const fields = parseFields("title,publishedAt");
    expect(fields).toEqual(["section", "slug", "title", "publishedAt"]);
    expect(Object.keys(project(entry, fields))).toEqual([
      "section",
      "slug",
      "title",
      "publishedAt",
    ]);
  });

  it("validates against an allowlist rather than reflecting the parameter", () => {
    expect(() => parseFields("title,secretKey")).toThrow(AppError);
    expect(() => parseFields("__proto__")).toThrow(AppError);
    expect(() => parseFields("content")).toThrow(AppError);
  });

  it("keeps a stable field order regardless of how they were asked for", () => {
    expect(parseFields("publishedAt,title")).toEqual(parseFields("title,publishedAt"));
  });

  it("ignores whitespace and duplicates and an empty list", () => {
    expect(parseFields(" title , title ")).toEqual(["section", "slug", "title"]);
    expect(parseFields(" , ")).toBeNull();
  });

  it("omits a requested field the entry does not have, rather than writing null", () => {
    const projected = project(entry, parseFields("cover"));
    expect(Object.keys(projected)).not.toContain("cover");
  });

  it("allows every summary field by name", () => {
    expect(parseFields(SUMMARY_FIELDS.join(","))).toEqual([...SUMMARY_FIELDS]);
  });

  it("parses limit, cursor and fields together off a URL", () => {
    const query = parseListQuery(
      new URL("https://zimoluo.me/api/v1/entries/blog?limit=5&cursor=2026-01-01T00:00:00Z|a&fields=title"),
    );
    expect(query.limit).toBe(5);
    expect(query.cursor).toEqual({ publishedAt: "2026-01-01T00:00:00Z", slug: "a" });
    expect(query.fields).toEqual(["section", "slug", "title"]);
  });
});

describe("D3 C6 / §2.2: the wire says section and slug, nothing about storage", () => {
  it("accepts the four sections and 404s anything else", () => {
    expect(requireSection("album")).toBe("album");
    expect(() => requireSection("photos")).toThrow(AppError);
    expect(() => requireSection("blog/text")).toThrow(AppError);
    expect(() => requireSection(undefined)).toThrow(AppError);
  });

  it("404s a slug it cannot validate, rather than reading a key from it", () => {
    expect(requireSlugParam("on-gradients")).toBe("on-gradients");
    expect(() => requireSlugParam("../../secret")).toThrow(AppError);
    expect(() => requireSlugParam("on-gradients.md")).toThrow(AppError);
    expect(() => requireSlugParam(undefined)).toThrow(AppError);
  });

  it("validates both params at once", () => {
    expect(requireEntryParams({ section: "blog", slug: "x" })).toEqual({
      section: "blog",
      slug: "x",
    });
  });

  it("refuses the v10 parameters outright, so no client can keep sending them", () => {
    for (const query of ["directory=blog/text", "mode=markdown", "filePath=blog/comments/x.json", "sub=abc"]) {
      expect(() =>
        rejectLegacyParams(new URL(`https://zimoluo.me/api/v1/entries/blog?${query}`)),
      ).toThrow(AppError);
    }
    expect(() =>
      rejectLegacyParams(new URL("https://zimoluo.me/api/v1/entries/blog?limit=5")),
    ).not.toThrow();
  });
});
