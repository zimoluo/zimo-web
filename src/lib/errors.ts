export type ErrorCode =
  | "invalid-request"
  | "unauthenticated"
  | "forbidden"
  | "not-found"
  | "conflict"
  | "precondition-failed"
  | "payload-too-large"
  | "unprocessable"
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

export const ERROR_STATUS: Readonly<Record<ErrorCode, number>> = {
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

export const ERROR_CODES = Object.keys(ERROR_STATUS) as readonly ErrorCode[];

export const statusFor = (code: ErrorCode): number => ERROR_STATUS[code];

export const isClientError = (code: ErrorCode): boolean =>
  ERROR_STATUS[code] < 500;

export const isAppError = (value: unknown): value is AppError =>
  value instanceof AppError;

export const PROBLEM_BASE = "https://zimoluo.me/problems";

export const problemType = (code: ErrorCode): string =>
  `${PROBLEM_BASE}/${code}`;

const TITLES: Readonly<Record<ErrorCode, string>> = {
  "invalid-request": "Invalid request",
  unauthenticated: "Not signed in",
  forbidden: "Not allowed",
  "not-found": "Not found",
  conflict: "Already exists",
  "precondition-failed": "Someone else changed this first",
  "payload-too-large": "Too large",
  unprocessable: "Cannot be processed",
  "rate-limited": "Too many requests",
  "upstream-failure": "Storage is unavailable",
  internal: "Something went wrong",
};

export const titleFor = (code: ErrorCode): string => TITLES[code];

export type Problem = {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail?: string;
  readonly instance?: string;
  readonly correlationId?: string;
};

export type ProblemOptions = {
  readonly instance?: string | undefined;
  readonly correlationId?: string | undefined;
};

export function toProblem(error: unknown, options: ProblemOptions = {}): Problem {
  const code: ErrorCode = isAppError(error) ? error.code : "internal";
  const problem: {
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    correlationId?: string;
  } = {
    type: problemType(code),
    title: titleFor(code),
    status: statusFor(code),
  };

  if (isClientError(code) && isAppError(error) && error.message.length > 0) {
    problem.detail = error.message;
  }

  if (options.instance !== undefined) problem.instance = options.instance;

  if (!isClientError(code) && options.correlationId !== undefined) {
    problem.correlationId = options.correlationId;
  }

  return problem;
}

export const retryAfterSeconds = (error: unknown): number | null => {
  if (!isAppError(error) || error.code !== "rate-limited") return null;
  const detail = error.detail;
  if (
    typeof detail === "object" &&
    detail !== null &&
    "retryAfter" in detail &&
    typeof (detail as { retryAfter: unknown }).retryAfter === "number"
  ) {
    return Math.max(1, Math.ceil((detail as { retryAfter: number }).retryAfter));
  }
  return null;
};
