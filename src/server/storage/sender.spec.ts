import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { afterEach, describe, expect, it } from "vitest";
import { createLocalS3 } from "./sender";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("local S3 response transport", () => {
  it("feeds UTF-8 JSON through the same stream decoder used by entry routes", async () => {
    const root = mkdtempSync(join(tmpdir(), "zw-sender-"));
    roots.push(root);
    const expected = { title: "日本語 – a gradient", content: "🌈" };
    writeFileSync(join(root, "entry.json"), JSON.stringify(expected));
    const result = await createLocalS3(root).send(
      new GetObjectCommand({ Bucket: "test", Key: "entry.json" }) as never,
    ) as { Body: AsyncIterable<Buffer> };
    let text = "";
    await pipeline(result.Body, async function* (source: AsyncIterable<Buffer>) {
      for await (const chunk of source) text += chunk.toString("utf8");
    });
    expect(JSON.parse(text)).toEqual(expected);
  });
});
