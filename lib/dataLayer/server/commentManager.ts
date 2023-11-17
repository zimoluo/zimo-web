import { awsBucket, awsBucketRegion } from "@/lib/constants/awsConfig";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import "server-only";
import { promisify } from "util";
import * as zlib from "zlib";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

const securityDataShutDown =
  process.env.NEXT_PUBLIC_ZIMO_WEB_DATA_SHUTDOWN === "true";

const awsKeyId = process.env.ZIMO_WEB_AWS_KEY_ID;
const awsSecretKey = process.env.ZIMO_WEB_AWS_SECRET_KEY;

if (!awsKeyId) {
  throw new Error("AWS_KEY_ID is undefined!");
}

if (!awsSecretKey) {
  throw new Error("AWS_SECRET_KEY_ZIMO_WEB is undefined!");
}

const s3 = new S3Client({
  region: awsBucketRegion,
  credentials: {
    accessKeyId: awsKeyId,
    secretAccessKey: awsSecretKey,
  },
});

const gzip = promisify(zlib.gzip);

export async function uploadCommentsToServer(
  filePath: string,
  comments: CommentEntry[]
): Promise<void> {
  try {
    if (securityDataShutDown) {
      throw new Error("Server is under maintenance.");
    }

    const compressedComments = await gzip(JSON.stringify({ comments }));

    const params = {
      Bucket: awsBucket,
      Key: filePath,
      Body: compressedComments,
      ContentEncoding: "gzip",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (error: any) {
    console.error(`Could not upload likedBy: ${error.message}`);
    throw error;
  }
}

export async function getComments(filePath: string): Promise<CommentEntry[]> {
  try {
    if (securityDataShutDown) {
      throw new Error("Server is under maintenance.");
    }

    const params = {
      Bucket: awsBucket,
      Key: filePath,
    };

    const command = new GetObjectCommand(params);
    const s3Object = await s3.send(command);

    if (!s3Object.Body) {
      return [];
    }

    let fileContents = "";

    const isGzipped = s3Object.ContentEncoding === "gzip";

    await pipeline(
      s3Object.Body as Readable,
      isGzipped ? zlib.createGunzip() : (source) => source,
      async function* (source) {
        for await (const chunk of source) {
          fileContents += chunk.toString("utf-8");
        }
      }
    );

    const data = JSON.parse(fileContents);

    if (typeof data.comments === "undefined") {
      return [];
    }

    return data.comments;
  } catch (error: any) {
    return [];
  }
}

export async function getEntryLike(filePath: string): Promise<string[]> {
  try {
    if (securityDataShutDown) {
      throw new Error("Server is under maintenance.");
    }

    const params = {
      Bucket: awsBucket,
      Key: filePath,
    };

    const command = new GetObjectCommand(params);
    const s3Object = await s3.send(command);

    if (!s3Object.Body) {
      return [];
    }

    let fileContents = "";

    const isGzipped = s3Object.ContentEncoding === "gzip";

    await pipeline(
      s3Object.Body as Readable,
      isGzipped ? zlib.createGunzip() : (source) => source,
      async function* (source) {
        for await (const chunk of source) {
          fileContents += chunk.toString("utf-8");
        }
      }
    );

    const data = JSON.parse(fileContents);

    if (typeof data.likedBy === "undefined") {
      return [];
    }

    return data.likedBy;
  } catch (error: any) {
    return [];
  }
}

export async function uploadEntryLikeToServer(
  filePath: string,
  likedBy: string[]
): Promise<void> {
  try {
    if (securityDataShutDown) {
      throw new Error("Server is under maintenance.");
    }

    const compressedLikedBy = await gzip(JSON.stringify({ likedBy }));

    const params = {
      Bucket: awsBucket,
      Key: filePath,
      Body: compressedLikedBy,
      ContentEncoding: "gzip",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (error: any) {
    console.error(`Could not upload likedBy: ${error.message}`);
    throw error;
  }
}
