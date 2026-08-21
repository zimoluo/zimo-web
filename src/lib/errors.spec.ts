import { describe, expect, it } from "vitest";
import { AppError, UnreachableError } from "./errors";

describe("AppError", () => {
  it("carries its code, message and detail", () => {
    const error = new AppError("not-found", "no such entry", { slug: "x" });
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe("not-found");
    expect(error.message).toBe("no such entry");
    expect(error.detail).toEqual({ slug: "x" });
    expect(error.name).toBe("AppError");
  });

  it("preserves a cause", () => {
    const cause = new Error("underlying");
    const error = new AppError("upstream-failure", "s3 read failed", undefined, { cause });
    expect(error.cause).toBe(cause);
  });
});

describe("UnreachableError", () => {
  it("reports the value that escaped an exhaustive switch", () => {
    const escaped = "unexpected-kind" as never;
    const error = new UnreachableError(escaped);
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe("internal");
    expect(error.name).toBe("UnreachableError");
    expect(error.message).toContain("unexpected-kind");
    expect(error.detail).toBe("unexpected-kind");
  });
});
