import "server-only";
import { awsBucket, awsBucketRegion } from "@/lib/constants/awsConfig";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as zlib from "zlib";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { cache } from "react";
import { generateInlineStyleObject } from "@/lib/themeHelper";

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

async function getRawThemeData(
  category: "theme" | "color-palette",
  name: string
): Promise<{ [key: string]: any }> {
  const directory = "theme";
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${category}/${name}.json`,
  };
  const command = new GetObjectCommand(params);
  const s3Object = await s3.send(command);

  if (!s3Object.Body) {
    throw new Error("Failed to fetch theme data from S3");
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

const fetchRawThemeData = cache(
  async (category: "theme" | "color-palette", name: string) => {
    return await getRawThemeData(category, name);
  }
);

export async function getColorPaletteStyle(name: string) {
  const rawData = await fetchRawThemeData("color-palette", name);
  const styleObject = generateInlineStyleObject(rawData);

  return styleObject;
}

export async function getThemeObjectData(name: string) {
  const rawData = await fetchRawThemeData("theme", name);

  return rawData;
}