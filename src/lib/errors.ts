export type ErrorCode =
  | "invalid-request"
  | "unauthenticated"
  | "forbidden"
  | "not-found"
  | "conflict"
  | "precondition-failed"
  | "payload-too-large"
  | "rate-limited"
  | "upstream-failure"
  | "internal";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly detail: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    detail?: unknown,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "AppError";
    this.code = code;
    this.detail = detail;
  }
}

export class UnreachableError extends AppError {
  constructor(value: never) {
    super("internal", `Unreachable value reached: ${JSON.stringify(value)}`, value);
    this.name = "UnreachableError";
  }
}
