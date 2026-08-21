import { AppError } from "../../lib/errors";
import type { JsonStore, ObjectRecord, WriteCondition } from "./mutate";
import type { ObjectRef, ObjectStore, Validator, WriteOptions } from "./object";

type Stored = { body: string; etag: string; updatedAt: string };

export class FakeObjectStore implements ObjectStore {
  private readonly objects = new Map<string, Stored>();

  private version = 0;

  readonly reads: string[] = [];

  readonly writes: string[] = [];

  private readonly clock: () => string;

  constructor(clock: () => string = () => "1970-01-01T00:00:00Z") {
    this.clock = clock;
  }

  seedText(key: string, body: string): void {
    this.version += 1;
    this.objects.set(key, {
      body,
      etag: `etag-${this.version}`,
      updatedAt: this.clock(),
    });
  }

  seedJson(key: string, value: unknown): void {
    this.seedText(key, JSON.stringify(value));
  }

  peek(key: string): string | undefined {
    return this.objects.get(key)?.body;
  }

  peekJson<T>(key: string): T | undefined {
    const body = this.peek(key);
    return body === undefined ? undefined : (JSON.parse(body) as T);
  }

  has(key: string): boolean {
    return this.objects.has(key);
  }

  keys(): readonly string[] {
    return [...this.objects.keys()];
  }

  readText = async (key: string): Promise<ObjectRecord<string> | null> => {
    this.reads.push(key);
    const found = this.objects.get(key);
    return found === undefined ? null : { value: found.body, etag: found.etag };
  };

  readJson = async <T>(
    key: string,
    validate: Validator<T>,
  ): Promise<ObjectRecord<T> | null> => {
    const record = await this.readText(key);
    if (record === null) return null;

    try {
      return { value: validate(JSON.parse(record.value)), etag: record.etag };
    } catch (cause) {
      throw new AppError("upstream-failure", "Stored object failed validation", key, {
        cause,
      });
    }
  };

  writeText = async (
    key: string,
    body: string,
    options: WriteOptions = {},
  ): Promise<string> => {
    this.writes.push(key);
    const existing = this.objects.get(key);

    if (options.ifAbsent === true && existing !== undefined) {
      throw this.precondition();
    }

    if (
      options.ifMatch !== undefined &&
      (existing === undefined || existing.etag !== options.ifMatch)
    ) {
      throw this.precondition();
    }

    this.seedText(key, body);
    return this.objects.get(key)?.etag ?? "";
  };

  writeJson = <T>(
    key: string,
    value: T,
    options: WriteOptions = {},
  ): Promise<string> => this.writeText(key, JSON.stringify(value), options);

  remove = async (key: string): Promise<void> => {
    this.objects.delete(key);
  };

  list = async (prefix: string): Promise<readonly ObjectRef[]> =>
    [...this.objects.entries()]
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, stored]) => ({
        key,
        size: stored.body.length,
        updatedAt: stored.updatedAt,
      }));

  asJsonStore = (): JsonStore => ({
    readRaw: async (key) => {
      const record = await this.readText(key);
      return record === null
        ? null
        : { value: JSON.parse(record.value) as unknown, etag: record.etag };
    },
    writeRaw: async (key, value, condition: WriteCondition) => {
      await this.writeText(key, JSON.stringify(value), {
        ...(condition?.ifAbsent === true ? { ifAbsent: true } : {}),
        ...(condition?.ifMatch !== undefined ? { ifMatch: condition.ifMatch } : {}),
      });
    },
  });

  private precondition(): Error {
    return Object.assign(new Error("PreconditionFailed"), {
      name: "PreconditionFailed",
      $metadata: { httpStatusCode: 412 },
    });
  }
}
