import { gunzipSync, gzipSync } from "node:zlib";

const GZIP_MAGIC = [0x1f, 0x8b] as const;

export const looksGzipped = (body: Uint8Array): boolean =>
  body.length >= 2 && body[0] === GZIP_MAGIC[0] && body[1] === GZIP_MAGIC[1];

export const compress = (text: string): Buffer =>
  gzipSync(Buffer.from(text, "utf8"), { level: 9 });

export function decompress(body: Uint8Array): string {
  const buffer = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  return looksGzipped(body)
    ? gunzipSync(buffer).toString("utf8")
    : buffer.toString("utf8");
}

export async function collect(
  stream: AsyncIterable<Uint8Array> | null | undefined,
): Promise<Uint8Array> {
  if (stream === null || stream === undefined) return new Uint8Array(0);

  const chunks: Uint8Array[] = [];
  let total = 0;

  for await (const chunk of stream) {
    chunks.push(chunk);
    total += chunk.byteLength;
  }

  const joined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return joined;
}
