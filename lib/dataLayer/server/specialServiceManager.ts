import type { TreeContent } from "@/src/features/christmas-tree/model/types";
import { awsBucket, awsBucketRegion } from "@/lib/constants/awsConfig";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "server-only";
import { storageClient } from "@/src/server/storage/sender";
import { promisify } from "util";
import * as zlib from "zlib";
import { getRawDataFromServer } from "./awsEntryFetcher";

const securityDataShutDown =
  process.env.NEXT_PUBLIC_ZIMO_WEB_DATA_SHUTDOWN === "true";

const s3 = storageClient();

const gzip = promisify(zlib.gzip);

export async function uploadTreeContentToServer(
  treeContent: TreeContent[]
): Promise<void> {
  try {
    if (securityDataShutDown) {
      throw new Error("Server is under maintenance.");
    }

    const treeJSON = await gzip(JSON.stringify({ treeContent }));

    const params = {
      Bucket: awsBucket,
      Key: "special/christmas/tree.json",
      Body: treeJSON,
      ContentEncoding: "gzip",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (error: any) {
    console.error(`Could not upload likedBy: ${error.message}`);
    throw error;
  }
}

export async function getTreeContentFromServer(): Promise<TreeContent[]> {
  const { treeContent } = await getRawDataFromServer(
    "special/christmas/tree.json",
    "json"
  );

  if (!Array.isArray(treeContent)) {
    return [];
  }

  return treeContent.map((item) => {
    if (
      typeof item === "object" &&
      item !== null &&
      "message" in item &&
      !item.isPublic
    ) {
      return { ...item, message: "" };
    }
    return item;
  }) as TreeContent[];
}
