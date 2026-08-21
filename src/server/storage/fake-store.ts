import type { JsonStore, ObjectRecord, WriteCondition } from "./mutate";

export type FakeStoreOptions = {
  /** Fail this many conditional writes with the given error before letting one through. */
  readonly failures?: number;
  readonly failureName?: string;
  readonly failureStatus?: number;
};

class PreconditionError extends Error {
  readonly $metadata: { readonly httpStatusCode: number };

  constructor(name: string, status: number) {
    super(name);
    this.name = name;
    this.$metadata = { httpStatusCode: status };
  }
}

/**
 * An in-memory stand-in for the S3 object store with real ETag semantics, so the
 * conditional-write contract can be exercised without a bucket.
 */
export class FakeJsonStore implements JsonStore {
  private readonly objects = new Map<string, { value: unknown; etag: string }>();

  private version = 0;

  private remainingFailures: number;

  private readonly failureName: string;

  private readonly failureStatus: number;

  readonly reads: string[] = [];

  readonly writes: { key: string; condition: WriteCondition }[] = [];

  constructor(options: FakeStoreOptions = {}) {
    this.remainingFailures = options.failures ?? 0;
    this.failureName = options.failureName ?? "PreconditionFailed";
    this.failureStatus = options.failureStatus ?? 412;
  }

  seed(key: string, value: unknown): void {
    this.version += 1;
    this.objects.set(key, { value, etag: `etag-${this.version}` });
  }

  peek(key: string): unknown {
    return this.objects.get(key)?.value;
  }

  readRaw = async (key: string): Promise<ObjectRecord<unknown> | null> => {
    this.reads.push(key);
    const record = this.objects.get(key);
    return record === undefined ? null : { value: record.value, etag: record.etag };
  };

  writeRaw = async (key: string, value: unknown, condition: WriteCondition): Promise<void> => {
    this.writes.push({ key, condition });

    if (this.remainingFailures > 0) {
      this.remainingFailures -= 1;
      throw new PreconditionError(this.failureName, this.failureStatus);
    }

    const existing = this.objects.get(key);

    if (condition?.ifAbsent === true && existing !== undefined) {
      throw new PreconditionError("PreconditionFailed", 412);
    }

    if (condition?.ifMatch !== undefined) {
      if (existing === undefined || existing.etag !== condition.ifMatch) {
        throw new PreconditionError("PreconditionFailed", 412);
      }
    }

    this.version += 1;
    this.objects.set(key, { value, etag: `etag-${this.version}` });
  };

  /** Simulate another writer landing between a read and a write. */
  interleave(key: string, value: unknown): void {
    this.seed(key, value);
  }
}
