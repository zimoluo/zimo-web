import {
  AppError,
  isAppError,
  isClientError,
  retryAfterSeconds,
  toProblem,
} from "../../lib/errors";
import type { ErrorCode, Problem } from "../../lib/errors";

export const PROBLEM_CONTENT_TYPE = "application/problem+json";

export type Logger = (record: {
  readonly correlationId: string;
  readonly code: ErrorCode;
  readonly error: unknown;
}) => void;

export type ProblemEnvironment = {
  readonly correlationId: () => string;
  readonly log: Logger;
};

const defaultEnvironment: ProblemEnvironment = {
  correlationId: () => crypto.randomUUID(),
  log: (record) => {
    console.error(
      `[${record.correlationId}] ${record.code}`,
      record.error instanceof Error ? record.error.stack : record.error,
    );
  },
};

let environment: ProblemEnvironment = defaultEnvironment;

export const setProblemEnvironment = (
  next: Partial<ProblemEnvironment>,
): void => {
  environment = { ...environment, ...next };
};

export const resetProblemEnvironment = (): void => {
  environment = defaultEnvironment;
};

export type ProblemContext = { readonly instance?: string | undefined };

export function problemFor(error: unknown, context: ProblemContext = {}): Problem {
  const code: ErrorCode = isAppError(error) ? error.code : "internal";

  if (isClientError(code)) {
    return toProblem(error, { instance: context.instance });
  }

  const correlationId = environment.correlationId();
  environment.log({ correlationId, code, error });
  return toProblem(error, { instance: context.instance, correlationId });
}

export function problemResponse(
  error: unknown,
  context: ProblemContext = {},
): Response {
  const problem = problemFor(error, context);
  const headers = new Headers({ "content-type": PROBLEM_CONTENT_TYPE });

  const retryAfter = retryAfterSeconds(error);
  if (retryAfter !== null) headers.set("retry-after", String(retryAfter));

  return new Response(JSON.stringify(problem), {
    status: problem.status,
    headers,
  });
}

export type RouteHandler<Ctx> = (
  request: Request,
  context: Ctx,
) => Promise<Response> | Response;

export const handler =
  <Ctx>(fn: RouteHandler<Ctx>): RouteHandler<Ctx> =>
  async (request, context) => {
    try {
      return await fn(request, context);
    } catch (error) {
      return problemResponse(error, { instance: instanceOf(request) });
    }
  };

const instanceOf = (request: Request): string | undefined => {
  try {
    return new URL(request.url).pathname;
  } catch {
    return undefined;
  }
};

export type JsonInit = {
  readonly status?: number;
  readonly headers?: Record<string, string>;
};

export function json(body: unknown, init: JsonInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json", ...init.headers },
  });
}

export const noContent = (headers: Record<string, string> = {}): Response =>
  new Response(null, { status: 204, headers });

export function invalid(message: string, detail?: unknown): AppError {
  return new AppError("invalid-request", message, detail);
}

export function notFound(message: string): AppError {
  return new AppError("not-found", message);
}
