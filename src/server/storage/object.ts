import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { AppError } from "../../lib/errors";
import { BUCKET, s3 } from "./client";
import { collect, compress, decompress } from "./codec";
import type { JsonStore, ObjectRecord, WriteCondition } from "./mutate";

export type Sender = {
  send: (command: unknown) => Promise<unknown>;
};

export type WriteOptions = {
  readonly ifMatch?: string | undefined;
  readonly ifAbsent?: boolean | undefined;
  readonly gzip?: boolean | undefined;
  readonly contentType?: string | undefined;
};

export type ObjectRef = {
  readonly key: string;
  readonly size: number;
  readonly updatedAt: string;
};

export type Validator<T> = (input: unknown) => T;

const NOT_FOUND_NAMES = new Set(["NoSuchKey", "NotFound"]);

const isAbsent = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) return false;
  const shaped = error as {
    name?: unknown;
    $metadata?: { httpStatusCode?: unknown };
  };
  return (
    (typeof shaped.name === "string" && NOT_FOUND_NAMES.has(shaped.name)) ||
    shaped.$metadata?.httpStatusCode === 404
  );
};

const normalizeEtag = (etag: string | undefined): string =>
  etag === undefined ? "" : etag.replaceAll('"', "");

export type ObjectStore = {
  readonly readText: (key: string) => Promise<ObjectRecord<string> | null>;
  readonly readJson: <T>(
    key: string,
    validate: Validator<T>,
  ) => Promise<ObjectRecord<T> | null>;
  readonly writeText: (
    key: string,
    body: string,
    options?: WriteOptions,
  ) => Promise<string>;
  readonly writeJson: <T>(
    key: string,
    value: T,
    options?: WriteOptions,
  ) => Promise<string>;
  readonly remove: (key: string) => Promise<void>;
  readonly list: (prefix: string) => Promise<readonly ObjectRef[]>;
  readonly asJsonStore: () => JsonStore;
};

export function createObjectStore(sender: Sender): ObjectStore {
  const readText = async (
    key: string,
  ): Promise<ObjectRecord<string> | null> => {
    let response: {
      Body?: AsyncIterable<Uint8Array>;
      ETag?: string;
    };

    try {
      response = (await sender.send(
        new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      )) as { Body?: AsyncIterable<Uint8Array>; ETag?: string };
    } catch (error) {
      if (isAbsent(error)) return null;
      throw new AppError("upstream-failure", "Could not read from storage", key, {
        cause: error,
      });
    }

    return {
      value: decompress(await collect(response.Body)),
      etag: normalizeEtag(response.ETag),
    };
  };

  const readJson = async <T>(
    key: string,
    validate: Validator<T>,
  ): Promise<ObjectRecord<T> | null> => {
    const record = await readText(key);
    if (record === null) return null;

    try {
      return { value: validate(JSON.parse(record.value)), etag: record.etag };
    } catch (cause) {
      throw new AppError(
        "upstream-failure",
        "Stored object failed validation",
        key,
        { cause },
      );
    }
  };

  const writeText = async (
    key: string,
    body: string,
    options: WriteOptions = {},
  ): Promise<string> => {
    const gzip = options.gzip ?? true;

    const input: Record<string, unknown> = {
      Bucket: BUCKET,
      Key: key,
      Body: gzip ? compress(body) : Buffer.from(body, "utf8"),
      ContentType: options.contentType ?? "application/json",
    };

    if (gzip) input.ContentEncoding = "gzip";
    if (options.ifMatch !== undefined) input.IfMatch = options.ifMatch;
    if (options.ifAbsent === true) input.IfNoneMatch = "*";

    const response = (await sender.send(new PutObjectCommand(input as never))) as {
      ETag?: string;
    };

    return normalizeEtag(response.ETag);
  };

  const writeJson = <T>(
    key: string,
    value: T,
    options: WriteOptions = {},
  ): Promise<string> => writeText(key, JSON.stringify(value), options);

  const remove = async (key: string): Promise<void> => {
    await sender.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  };

  const list = async (prefix: string): Promise<readonly ObjectRef[]> => {
    const refs: ObjectRef[] = [];
    let token: string | undefined;

    do {
      const page = (await sender.send(
        new ListObjectsV2Command({
          Bucket: BUCKET,
          Prefix: prefix,
          ContinuationToken: token,
        }),
      )) as {
        Contents?: { Key?: string; Size?: number; LastModified?: Date }[];
        NextContinuationToken?: string;
      };

      for (const object of page.Contents ?? []) {
        if (object.Key === undefined) continue;
        refs.push({
          key: object.Key,
          size: object.Size ?? 0,
          updatedAt: (object.LastModified ?? new Date(0)).toISOString(),
        });
      }

      token = page.NextContinuationToken;
    } while (token !== undefined);

    return refs;
  };

  const asJsonStore = (): JsonStore => ({
    readRaw: async (key) => {
      const record = await readText(key);
      if (record === null) return null;
      try {
        return { value: JSON.parse(record.value) as unknown, etag: record.etag };
      } catch (cause) {
        throw new AppError(
          "upstream-failure",
          "Stored object is not valid JSON",
          key,
          { cause },
        );
      }
    },

    writeRaw: async (key, value, condition: WriteCondition) => {
      const options: WriteOptions = {};
      await writeText(key, JSON.stringify(value), {
        ...options,
        ...(condition?.ifAbsent === true ? { ifAbsent: true } : {}),
        ...(condition?.ifMatch !== undefined
          ? { ifMatch: condition.ifMatch }
          : {}),
      });
    },
  });

  return {
    readText,
    readJson,
    writeText,
    writeJson,
    remove,
    list,
    asJsonStore,
  };
}

let shared: ObjectStore | null = null;

export function objects(): ObjectStore {
  if (shared === null) shared = createObjectStore(s3() as unknown as Sender);
  return shared;
}

export const setObjectStore = (store: ObjectStore | null): void => {
  shared = store;
};
