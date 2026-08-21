import "server-only";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createHash } from "node:crypto";
import { AppError } from "../../lib/errors";
import type { JsonStore, ObjectRecord, WriteCondition } from "./mutate";
import type { ObjectRef, ObjectStore, Validator, WriteOptions } from "./object";

export const LOCAL_ROOT_VARIABLE = "ZIMO_WEB_LOCAL_STORAGE";

export const DEFAULT_LOCAL_ROOT = ".local-storage";

const etagOf = (body: string): string =>
  createHash("sha256").update(body).digest("hex").slice(0, 32);

const safeJoin = (root: string, key: string): string => {
  const path = resolve(root, key);
  if (path !== root && !path.startsWith(`${root}/`)) {
    throw new AppError("invalid-request", "Key escapes the local storage root", key);
  }
  return path;
};

const precondition = (): Error =>
  Object.assign(new Error("PreconditionFailed"), {
    name: "PreconditionFailed",
    $metadata: { httpStatusCode: 412 },
  });

export function createLocalObjectStore(rootPath: string): ObjectStore {
  const root = resolve(rootPath);

  const readText = async (
    key: string,
  ): Promise<ObjectRecord<string> | null> => {
    const path = safeJoin(root, key);
    if (!existsSync(path) || statSync(path).isDirectory()) return null;

    const body = readFileSync(path, "utf8");
    return { value: body, etag: etagOf(body) };
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
    const path = safeJoin(root, key);
    const existing = existsSync(path) ? readFileSync(path, "utf8") : null;

    if (options.ifAbsent === true && existing !== null) throw precondition();

    if (options.ifMatch !== undefined) {
      if (existing === null || etagOf(existing) !== options.ifMatch) {
        throw precondition();
      }
    }

    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body, "utf8");

    return etagOf(body);
  };

  const writeJson = <T>(
    key: string,
    value: T,
    options: WriteOptions = {},
  ): Promise<string> => writeText(key, JSON.stringify(value), options);

  const remove = async (key: string): Promise<void> => {
    const path = safeJoin(root, key);
    if (existsSync(path)) rmSync(path, { force: true });
  };

  const list = async (prefix: string): Promise<readonly ObjectRef[]> => {
    const refs: ObjectRef[] = [];

    const walk = (directory: string): void => {
      if (!existsSync(directory)) return;

      for (const name of readdirSync(directory).sort()) {
        const path = join(directory, name);
        const stats = statSync(path);

        if (stats.isDirectory()) {
          walk(path);
          continue;
        }

        const key = relative(root, path);
        if (!key.startsWith(prefix)) continue;

        refs.push({
          key,
          size: stats.size,
          updatedAt: new Date(stats.mtimeMs).toISOString(),
        });
      }
    };

    walk(root);
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
      await writeText(key, JSON.stringify(value), {
        ...(condition?.ifAbsent === true ? { ifAbsent: true } : {}),
        ...(condition?.ifMatch !== undefined ? { ifMatch: condition.ifMatch } : {}),
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

export const localRoot = (): string =>
  resolve(process.env[LOCAL_ROOT_VARIABLE] ?? DEFAULT_LOCAL_ROOT);
