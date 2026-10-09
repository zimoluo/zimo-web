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
import { S3Client } from "@aws-sdk/client-s3";
import { hasCredentials, s3 } from "./client";
import { localRoot } from "./local-store";

export type CommandLike = {
  readonly constructor: { readonly name: string };
  readonly input: Record<string, unknown>;
};

export type S3Sender = { readonly send: (command: never) => Promise<unknown> };

const notFound = (): Error =>
  Object.assign(new Error("The specified key does not exist."), {
    name: "NoSuchKey",
    $metadata: { httpStatusCode: 404 },
  });

const bodyOf = (contents: Buffer): AsyncIterable<Uint8Array> =>
  (async function* stream() {
    yield contents;
  })();

const walk = (root: string, directory: string, out: string[]): void => {
  if (!existsSync(directory)) return;

  for (const name of readdirSync(directory).sort()) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(root, path, out);
    else out.push(relative(root, path));
  }
};

const safeJoin = (root: string, key: string): string => {
  const path = resolve(root, key);
  if (path !== root && !path.startsWith(`${root}/`)) {
    throw new Error(`key escapes the local storage root: ${key}`);
  }
  return path;
};

export function createLocalS3(rootPath: string): S3Sender {
  const root = resolve(rootPath);

  return {
    send: async (raw) => {
      const command = raw as unknown as CommandLike;
      const name = command.constructor.name;
      const key = command.input.Key as string | undefined;

      switch (name) {
        case "ListObjectsV2Command": {
          const prefix = (command.input.Prefix as string | undefined) ?? "";
          const files: string[] = [];
          walk(root, root, files);

          return {
            Contents: files
              .filter((file) => file.startsWith(prefix))
              .map((file) => {
                const stats = statSync(join(root, file));
                return {
                  Key: file,
                  Size: stats.size,
                  LastModified: new Date(stats.mtimeMs),
                };
              }),
            $metadata: { httpStatusCode: 200 },
          };
        }

        case "GetObjectCommand": {
          if (key === undefined) throw notFound();
          const path = safeJoin(root, key);
          if (!existsSync(path) || statSync(path).isDirectory()) throw notFound();

          const contents = readFileSync(path);
          return {
            Body: bodyOf(contents),
            ETag: `"${contents.byteLength}"`,
            ContentLength: contents.byteLength,
            $metadata: { httpStatusCode: 200 },
          };
        }

        case "HeadObjectCommand": {
          if (key === undefined) throw notFound();
          const path = safeJoin(root, key);
          if (!existsSync(path)) {
            throw Object.assign(new Error("Not Found"), {
              name: "NotFound",
              $metadata: { httpStatusCode: 404 },
            });
          }
          return { $metadata: { httpStatusCode: 200 } };
        }

        case "PutObjectCommand": {
          if (key === undefined) throw notFound();
          const path = safeJoin(root, key);
          mkdirSync(dirname(path), { recursive: true });

          const body = command.input.Body;
          writeFileSync(
            path,
            typeof body === "string" ? body : Buffer.from(body as Uint8Array),
          );

          return { ETag: '"local"', $metadata: { httpStatusCode: 200 } };
        }

        case "DeleteObjectCommand": {
          if (key !== undefined) {
            const path = safeJoin(root, key);
            if (existsSync(path)) rmSync(path, { force: true });
          }
          return { $metadata: { httpStatusCode: 204 } };
        }

        default:
          throw new Error(`local storage does not emulate ${name}`);
      }
    },
  };
}

export const LOCAL_FLAG = "ZIMO_WEB_LOCAL_STORAGE_ONLY";

export function usingLocalStorage(): boolean {
  if (process.env[LOCAL_FLAG] === "true") return true;
  return !hasCredentials();
}

let sender: S3Sender | null = null;
let announced = false;

export function storageSender(): S3Sender {
  if (sender !== null) return sender;

  if (usingLocalStorage()) {
    const root = localRoot();

    if (!announced) {
      announced = true;
      console.warn(
        `storage: serving ${root} from disk instead of S3. ` +
          `Seed it with npm run content:seed, or set ZIMO_WEB_AWS_KEY_ID to use the bucket.`,
      );
    }

    sender = createLocalS3(root);
    return sender;
  }

  sender = s3() as unknown as S3Sender;
  return sender;
}

export const storageClient = (): S3Client =>
  storageSender() as unknown as S3Client;
