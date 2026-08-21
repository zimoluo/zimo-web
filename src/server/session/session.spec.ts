import { describe, expect, it } from "vitest";
import { AppError } from "../../lib/errors";
import {
  CLEARED_COOKIE_OPTIONS,
  LEGACY_SESSION_COOKIE,
  RENDER_COOKIE,
  RENDER_COOKIE_OPTIONS,
  readCookie,
  readSessionCookie,
  ROTATE_AFTER_SECONDS,
  serializeCookie,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  SESSION_MAX_AGE_SECONDS,
} from "./cookie";
import {
  ALGORITHM,
  nowSeconds,
  secretFrom,
  shouldRotate,
  signSession,
  verifySession,
} from "./token";
import {
  isAdmin,
  isBanned,
  MAX_COMMENT_LENGTH,
  owns,
  requireActive,
  requireAdmin,
  requireBody,
  requireOwner,
  requireOwnerOrAdmin,
  requireViewer,
} from "./authorize";
import type { Viewer } from "./authorize";

const secret = secretFrom("a-test-secret-long-enough-for-hs256");
const other = secretFrom("a-different-secret-long-enough-too");

const viewer = (overrides: Partial<Viewer> = {}): Viewer => ({
  sub: "sub-a",
  state: "normal",
  ...overrides,
});

describe("D3 C12: the session cookie", () => {
  it("is SameSite=Lax, so a visitor arriving from an external link is signed in on first paint", () => {
    expect(SESSION_COOKIE_OPTIONS.sameSite).toBe("lax");
    expect(serializeCookie(SESSION_COOKIE, "token", SESSION_COOKIE_OPTIONS)).toContain(
      "SameSite=Lax",
    );
  });

  it("is HttpOnly, Secure, root-scoped and 180 days", () => {
    const header = serializeCookie(SESSION_COOKIE, "token", SESSION_COOKIE_OPTIONS);
    expect(header).toContain("HttpOnly");
    expect(header).toContain("Secure");
    expect(header).toContain("Path=/");
    expect(header).toContain(`Max-Age=${SESSION_MAX_AGE_SECONDS}`);
    expect(SESSION_MAX_AGE_SECONDS).toBe(180 * 24 * 60 * 60);
  });

  it("is named session, and reads the v10 name for one release", () => {
    expect(SESSION_COOKIE).toBe("session");
    expect(readSessionCookie(`${SESSION_COOKIE}=new-token`)).toBe("new-token");
    expect(readSessionCookie(`${LEGACY_SESSION_COOKIE}=old-token`)).toBe("old-token");
  });

  it("prefers the new name when a browser holds both", () => {
    expect(
      readSessionCookie(`${LEGACY_SESSION_COOKIE}=old; ${SESSION_COOKIE}=new`),
    ).toBe("new");
  });

  it("returns null when there is no cookie at all", () => {
    expect(readSessionCookie(null)).toBeNull();
    expect(readSessionCookie("")).toBeNull();
    expect(readSessionCookie("other=1")).toBeNull();
  });

  it("does not confuse a cookie whose name ends in the one it wants", () => {
    expect(readCookie("not_session=wrong; session=right", "session")).toBe("right");
  });

  it("survives whitespace and an encoded value", () => {
    expect(readCookie("  a=1 ;  session = %2Fslash%2F ", "session")).toBe("/slash/");
    expect(serializeCookie("session", "a b", SESSION_COOKIE_OPTIONS)).toContain(
      "session=a%20b",
    );
  });

  it("ignores a malformed pair rather than throwing", () => {
    expect(readCookie("garbage; session=ok", "session")).toBe("ok");
  });

  it("clears by expiring immediately", () => {
    expect(serializeCookie(SESSION_COOKIE, "", CLEARED_COOKIE_OPTIONS)).toContain(
      "Max-Age=0",
    );
  });

  it("D5 section 6: the render cookie is readable by the client that writes it", () => {
    expect(RENDER_COOKIE).toBe("zw.render");
    expect(RENDER_COOKIE_OPTIONS.httpOnly).toBe(false);
    expect(RENDER_COOKIE_OPTIONS.sameSite).toBe("lax");
    expect(serializeCookie(RENDER_COOKIE, "t=velvet&s=dark", RENDER_COOKIE_OPTIONS)).not.toContain(
      "HttpOnly",
    );
  });
});

describe("D3 section 4: session tokens", () => {
  it("round-trips a subject", async () => {
    const token = await signSession("sub-a", secret);
    await expect(verifySession(token, secret)).resolves.toMatchObject({ sub: "sub-a" });
  });

  it("stays HS256", async () => {
    const token = await signSession("sub-a", secret);
    const header = JSON.parse(
      Buffer.from(token.split(".")[0] as string, "base64url").toString("utf8"),
    ) as { alg: string };
    expect(header.alg).toBe(ALGORITHM);
    expect(ALGORITHM).toBe("HS256");
  });

  it("rejects a token signed with another secret", async () => {
    const token = await signSession("sub-a", other);
    await expect(verifySession(token, secret)).resolves.toBeNull();
  });

  it("rejects a tampered token rather than throwing", async () => {
    const token = await signSession("sub-a", secret);
    const [head, , signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ sub: "sub-b" }), "utf8").toString(
      "base64url",
    );
    await expect(verifySession(`${head}.${forged}.${signature}`, secret)).resolves.toBeNull();
  });

  it("rejects nonsense without throwing", async () => {
    for (const bad of ["", "not.a.token", "a.b", "..", "null"]) {
      await expect(verifySession(bad, secret)).resolves.toBeNull();
    }
  });

  it("rejects an expired token", async () => {
    const longAgo = nowSeconds() - SESSION_MAX_AGE_SECONDS - 60;
    const token = await signSession("sub-a", secret, longAgo);
    await expect(verifySession(token, secret)).resolves.toBeNull();
  });

  it("rejects the alg=none downgrade", async () => {
    const head = Buffer.from(JSON.stringify({ alg: "none" }), "utf8").toString(
      "base64url",
    );
    const body = Buffer.from(JSON.stringify({ sub: "sub-a" }), "utf8").toString(
      "base64url",
    );
    await expect(verifySession(`${head}.${body}.`, secret)).resolves.toBeNull();
  });

  it("insists a secret is configured, rather than signing with an empty key", () => {
    expect(() => secretFrom(undefined)).toThrow(AppError);
    expect(() => secretFrom("")).toThrow(AppError);
  });

  it("rotates a token older than 30 days, and leaves a fresh one alone", () => {
    const at = nowSeconds();
    const claims = (age: number) => ({
      sub: "sub-a",
      iat: at - age,
      exp: at - age + SESSION_MAX_AGE_SECONDS,
    });

    expect(shouldRotate(claims(0), at)).toBe(false);
    expect(shouldRotate(claims(ROTATE_AFTER_SECONDS - 1), at)).toBe(false);
    expect(shouldRotate(claims(ROTATE_AFTER_SECONDS), at)).toBe(true);
    expect(shouldRotate(claims(SESSION_MAX_AGE_SECONDS - 1), at)).toBe(true);
  });

  it("carries an iat, which is what makes rotation possible", async () => {
    const issuedAt = nowSeconds() - 100;
    const token = await signSession("sub-a", secret, issuedAt);
    await expect(verifySession(token, secret)).resolves.toMatchObject({ iat: issuedAt });
  });
});

describe("D3 C7: the session is the identity", () => {
  it("refuses an anonymous caller", () => {
    expect(() => requireViewer(null)).toThrow(AppError);
    try {
      requireViewer(null);
    } catch (error) {
      expect((error as AppError).code).toBe("unauthenticated");
    }
  });

  it("refuses a banned user with 403, not 401", () => {
    try {
      requireActive(viewer({ state: "banned" }));
      expect.unreachable();
    } catch (error) {
      expect((error as AppError).code).toBe("forbidden");
    }
    expect(isBanned(viewer({ state: "banned" }))).toBe(true);
  });

  it("lets a normal user act", () => {
    expect(requireActive(viewer()).sub).toBe("sub-a");
  });

  it("gates admin actions", () => {
    expect(requireAdmin(viewer({ state: "admin" })).state).toBe("admin");
    expect(() => requireAdmin(viewer())).toThrow(AppError);
    expect(() => requireAdmin(null)).toThrow(AppError);
    expect(isAdmin(viewer({ state: "admin" }))).toBe(true);
    expect(isAdmin(null)).toBe(false);
  });

  it("checks ownership against the session, never against a passed sub", () => {
    const comment = { authorSub: "sub-a" };
    expect(owns(viewer(), comment)).toBe(true);
    expect(owns(viewer({ sub: "sub-b" }), comment)).toBe(false);
    expect(owns(null, comment)).toBe(false);
    expect(requireOwner(viewer(), comment).sub).toBe("sub-a");
    expect(() => requireOwner(viewer({ sub: "sub-b" }), comment)).toThrow(AppError);
  });

  it("lets an admin delete someone else's comment but not edit it", () => {
    const comment = { authorSub: "sub-a" };
    const admin = viewer({ sub: "sub-admin", state: "admin" });
    expect(requireOwnerOrAdmin(admin, comment).sub).toBe("sub-admin");
    expect(() => requireOwner(admin, comment)).toThrow(AppError);
  });

  it("does not let a banned user delete their own comment", () => {
    expect(() => requireOwnerOrAdmin(viewer({ state: "banned" }), { authorSub: "sub-a" })).toThrow(
      AppError,
    );
  });
});

describe("comment bodies", () => {
  it("trims and requires content", () => {
    expect(requireBody("  hello  ")).toBe("hello");
    expect(() => requireBody("   ")).toThrow(AppError);
    expect(() => requireBody("\n\t")).toThrow(AppError);
  });

  it("refuses an over-long comment as unprocessable, not as an internal error", () => {
    try {
      requireBody("a".repeat(MAX_COMMENT_LENGTH + 1));
      expect.unreachable();
    } catch (error) {
      expect((error as AppError).code).toBe("unprocessable");
      expect((error as AppError).message).toContain(String(MAX_COMMENT_LENGTH));
    }
    expect(requireBody("a".repeat(MAX_COMMENT_LENGTH))).toHaveLength(MAX_COMMENT_LENGTH);
  });
});
