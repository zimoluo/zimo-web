import { AppError } from "../../lib/errors";

export type ObjectRecord<T> = { readonly value: T; readonly etag: string };

export type WriteCondition =
  | { readonly ifAbsent: true; readonly ifMatch?: undefined }
  | { readonly ifMatch: string; readonly ifAbsent?: undefined }
  | undefined;

export type JsonStore = {
  readonly readRaw: (key: string) => Promise<ObjectRecord<unknown> | null>;
  readonly writeRaw: (
    key: string,
    value: unknown,
    condition: WriteCondition,
  ) => Promise<void>;
};

export type Validator<T> = (input: unknown) => T;

export type MutateOptions = {
  readonly attempts?: number | undefined;
  readonly sleep?: ((ms: number) => Promise<void>) | undefined;
  readonly jitter?: (() => number) | undefined;
};

export const BACKOFF_MS = [25, 60, 140, 320] as const;

export function isRetryableConflict(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const named = error as {
    name?: unknown;
    $metadata?: { httpStatusCode?: unknown };
  };

  const status = named.$metadata?.httpStatusCode;

  return (
    named.name === "PreconditionFailed" ||
    named.name === "ConditionalRequestConflict" ||
    named.name === "PreconditionRequired" ||
    status === 412 ||
    status === 409 ||
    status === 428
  );
}

export function jitteredBackoff(attempt: number, jitter: () => number): number {
  const base = BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)] ?? 320;
  const spread = 0.4;
  return Math.round(base * (1 - spread + 2 * spread * jitter()));
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export async function readJson<T>(
  store: JsonStore,
  key: string,
  validate: Validator<T>,
): Promise<ObjectRecord<T> | null> {
  const record = await store.readRaw(key);
  if (record === null) return null;

  try {
    return { value: validate(record.value), etag: record.etag };
  } catch (cause) {
    throw new AppError("upstream-failure", `Stored object at ${key} failed validation`, key, {
      cause,
    });
  }
}

export async function mutateJson<T>(
  store: JsonStore,
  key: string,
  validate: Validator<T>,
  initial: () => T,
  update: (current: T) => T,
  options: MutateOptions = {},
): Promise<T> {
  const attempts = Math.max(1, options.attempts ?? 5);
  const sleep = options.sleep ?? defaultSleep;
  const jitter = options.jitter ?? (() => 0.5);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const current = await readJson(store, key, validate);
    const next = update(current === null ? initial() : current.value);

    try {
      await store.writeRaw(
        key,
        next,
        current === null ? { ifAbsent: true } : { ifMatch: current.etag },
      );
      return next;
    } catch (error) {
      if (!isRetryableConflict(error)) throw error;
      if (attempt === attempts - 1) break;
      await sleep(jitteredBackoff(attempt, jitter));
    }
  }

  throw new AppError(
    "conflict",
    "Could not apply the change; please retry.",
    { key, attempts },
  );
}
