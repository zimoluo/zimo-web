import "server-only";
import { S3Client } from "@aws-sdk/client-s3";
import { AppError } from "../../lib/errors";

export const BUCKET = "zimo-web-bucket";
export const REGION = "us-east-2";
export const REQUEST_TIMEOUT_MS = 8_000;

export const BUCKET_ORIGIN = `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

let client: S3Client | null = null;

const credentials = (): { accessKeyId: string; secretAccessKey: string } => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (
    accessKeyId === undefined ||
    accessKeyId === "" ||
    secretAccessKey === undefined ||
    secretAccessKey === ""
  ) {
    throw new AppError(
      "upstream-failure",
      "Storage credentials are not configured",
    );
  }

  return { accessKeyId, secretAccessKey };
};

export function s3(): S3Client {
  if (client === null) {
    client = new S3Client({
      region: REGION,
      credentials: credentials(),
      requestHandler: { requestTimeout: REQUEST_TIMEOUT_MS },
    });
  }
  return client;
}

export const resetClient = (): void => {
  client = null;
};
