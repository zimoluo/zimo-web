import { awsBucket, awsBucketRegion } from "@/lib/constants/awsConfig";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "server-only";
import { promisify } from "util";
import * as zlib from "zlib";
import { getRawDataFromServer } from "./awsEntryFetcher";

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

  return (treeContent || []) as TreeContent[];
}
