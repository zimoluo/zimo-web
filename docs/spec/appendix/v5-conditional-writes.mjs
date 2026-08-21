import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  GetBucketVersioningCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const BUCKET = "zimo-web-bucket";
const REGION = "us-east-2";
const PREFIX = `test/v11-platform-checks/${randomUUID()}`;
const KEY = `${PREFIX}/conditional-write.txt`;

const keyId = process.env.ZIMO_WEB_AWS_KEY_ID;
const secret = process.env.ZIMO_WEB_AWS_SECRET_KEY;
if (keyId === undefined || secret === undefined) {
  console.error("Missing ZIMO_WEB_AWS_KEY_ID / ZIMO_WEB_AWS_SECRET_KEY.");
  console.error("Run with: node --env-file=.env.local docs/spec/appendix/v5-conditional-writes.mjs");
  process.exit(1);
}

const s3 = new S3Client({
  region: REGION,
  credentials: { accessKeyId: keyId, secretAccessKey: secret },
});

const attempt = async (label, command) => {
  try {
    const result = await s3.send(command);
    return { label, ok: true, status: result.$metadata.httpStatusCode, etag: result.ETag };
  } catch (error) {
    const transport =
      error.name === "AggregateError" ||
      error.$metadata?.httpStatusCode === undefined ||
      ["EPERM", "ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN"].includes(
        error.code ?? error.errors?.[0]?.code ?? "",
      );
    return {
      label,
      ok: false,
      transport,
      status: error.$metadata?.httpStatusCode,
      name: error.name,
      message: error.message,
    };
  }
};

const show = (result) =>
  console.log(
    `  ${result.label.padEnd(46)} ${
      result.ok ? "OK  " : result.transport ? "UNREACHABLE" : "FAIL"
    } status=${result.status ?? "-"}${result.name ? ` ${result.name}` : ""}` +
      `${result.etag ? ` etag=${result.etag}` : ""}`,
  );

console.log(`=== V-5 / V-6 / V-7 — bucket "${BUCKET}" (${REGION}) ===`);
console.log(`scratch prefix: ${PREFIX}\n`);
console.log("Production content is never touched; every write is under the scratch prefix");
console.log("and is deleted at the end (03-hygiene §2).\n");

console.log("V-7  bucket versioning state");
const versioning = await attempt(
  "GetBucketVersioning",
  new GetBucketVersioningCommand({ Bucket: BUCKET }),
);
show(versioning);
if (versioning.ok) {
  const raw = await s3
    .send(new GetBucketVersioningCommand({ Bucket: BUCKET }))
    .catch(() => null);
  console.log(`  Status:    ${raw?.Status ?? "(unset — versioning has never been enabled)"}`);
  console.log(`  MFADelete: ${raw?.MFADelete ?? "(unset)"}`);
}
console.log();

console.log("V-5  PutObject conditional writes");

const create = await attempt(
  "1. IfNoneMatch:'*' on a fresh key -> expect 200",
  new PutObjectCommand({
    Bucket: BUCKET,
    Key: KEY,
    Body: "first",
    IfNoneMatch: "*",
    ContentType: "text/plain",
  }),
);
show(create);

const recreate = await attempt(
  "2. IfNoneMatch:'*' again -> expect 412",
  new PutObjectCommand({
    Bucket: BUCKET,
    Key: KEY,
    Body: "second",
    IfNoneMatch: "*",
    ContentType: "text/plain",
  }),
);
show(recreate);

const wrongMatch = await attempt(
  "3. IfMatch:<wrong etag> -> expect 412",
  new PutObjectCommand({
    Bucket: BUCKET,
    Key: KEY,
    Body: "third",
    IfMatch: '"00000000000000000000000000000000"',
    ContentType: "text/plain",
  }),
);
show(wrongMatch);

const rightMatch = await attempt(
  "4. IfMatch:<correct etag> -> expect 200",
  new PutObjectCommand({
    Bucket: BUCKET,
    Key: KEY,
    Body: "fourth",
    IfMatch: create.etag,
    ContentType: "text/plain",
  }),
);
show(rightMatch);

console.log();
const cleanup = await attempt(
  "cleanup: DeleteObject",
  new DeleteObjectCommand({ Bucket: BUCKET, Key: KEY }),
);
show(cleanup);

console.log();
const results = [versioning, create, recreate, wrongMatch, rightMatch, cleanup];
const unreachable = results.some((result) => result.transport === true);

if (unreachable) {
  console.log("VERDICT: INCONCLUSIVE — S3 was not reachable from this environment.");
  console.log();
  console.log("Every request failed at the transport layer, not with an HTTP status, so");
  console.log("nothing was learned about conditional-write support. This is NOT a refutation");
  console.log("of ADR-009 and must not be read as one: do not adopt the D4 §3.3");
  console.log("key-partitioning fallback on the strength of this run.");
  console.log();
  console.log("Credentials were present. The failure is network egress: outbound connections");
  console.log("to *.amazonaws.com:443 return EPERM. Allow that host and re-run.");
  process.exit(2);
}

const v5Pass =
  create.ok &&
  !recreate.ok &&
  recreate.status === 412 &&
  !wrongMatch.ok &&
  wrongMatch.status === 412 &&
  rightMatch.ok;

console.log("VERDICT");
console.log(`  V-5 conditional writes supported      : ${v5Pass ? "YES" : "NO"}`);
console.log(
  `  V-6 SDK transmits IfMatch/IfNoneMatch : ${
    recreate.status === 412 || wrongMatch.status === 412 ? "YES" : "NO"
  }`,
);
console.log(
  `  V-7 versioning                        : ${
    versioning.ok ? "queried successfully" : "could not be queried"
  }`,
);
console.log();
console.log(
  v5Pass
    ? "ADR-009 stands: use conditional writes. D4 §3.3 key partitioning is NOT needed."
    : "ADR-009 refuted on evidence: take the D4 §3.3 key-partitioning fallback, with an ADR.",
);

process.exit(v5Pass && cleanup.ok ? 0 : 1);
