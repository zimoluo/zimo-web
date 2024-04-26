import "server-only";
import { awsBucket, awsBucketRegion } from "@/lib/constants/awsConfig";
import { PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

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

const contentTypeMap: Record<AllowedImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};

export async function uploadThemeImageToServer(
  objectKey: string,
  format: AllowedImageFormat,
  stream: ReadableStream
): Promise<boolean> {
  try {
    const contentType = contentTypeMap[format];

    if (!contentType) {
      throw new Error("Unsupported image format");
    }

    const params: PutObjectCommandInput = {
      Bucket: awsBucket,
      Key: objectKey,
      Body: stream,
      ContentType: contentType,
    };

    const upload = new Upload({
      client: s3,
      params: params,
    });

    await upload.done();
    return true;
  } catch (error: any) {
    console.error(`Could not upload theme image: ${error.message}`);
    return false;
  }
}
