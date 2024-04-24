import "server-only";
import { awsBucket, awsBucketRegion } from "@/lib/constants/awsConfig";
import {
  GetObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import * as zlib from "zlib";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { cache } from "react";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
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

async function getRawColorPaletteData(
  name: string
): Promise<{ [key: string]: any }> {
  const directory = "theme/colorPalette";
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${name}.json`,
  };
  const command = new GetObjectCommand(params);
  const s3Object = await s3.send(command);

  if (!s3Object.Body) {
    throw new Error("Failed to fetch color palette data from S3");
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
  return data;
}

const fetchRawColorPaletteData = cache(async (name: string) => {
  return await getRawColorPaletteData(name);
});

export async function getColorPaletteStyle(name: string) {
  const rawData = await fetchRawColorPaletteData(name);
  const styleObject = generateInlineStyleObject(rawData as RawColorPaletteData);

  return styleObject;
}

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