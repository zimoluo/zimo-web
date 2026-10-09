import { AppError } from "../../lib/errors";

export async function readLimitedBody(request: Request, limit: number, tooLarge: string): Promise<Uint8Array<ArrayBuffer>> {
  if (Number(request.headers.get("content-length") ?? 0) > limit) throw new AppError("payload-too-large", tooLarge);
  const reader = request.body?.getReader();
  if (reader === undefined) throw new AppError("invalid-request", "The request is empty.");
  const parts: Uint8Array[] = [];
  let bytes = 0;
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new AppError("payload-too-large", tooLarge);
      }
      parts.push(chunk.value);
    }
  } finally { reader.releaseLock(); }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const part of parts) { buffer.set(part, offset); offset += part.byteLength; }
  return buffer;
}
