import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import matter from "gray-matter";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import zlib from "zlib";
import { awsBucket, awsBucketRegion } from "@/lib/constants/awsConfig";
import "server-only";
import { cache } from "react";

interface Items {
  [key: string]: any;
}

interface MarkdownData {
  content: string;
  [key: string]: any;
}

interface JSONData {
  [key: string]: any;
}

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

async function getSlugs(directory: string, fileExtension: string) {
  const command = new ListObjectsV2Command({
    Bucket: awsBucket,
    Prefix: directory,
  });

  const response = await s3.send(command);

  const slugs = response.Contents?.map(({ Key }) => Key)
    .filter((key): key is string => !!key && key.endsWith(`.${fileExtension}`))
    .map((key) => key.split("/").pop());

  return slugs || [];
}

/**
 * The raw AWS fetch function without cache or formatted path. Only used for custom cases.
 */
export async function getRawDataFromServer<T extends MarkdownData | JSONData>(
  path: string,
  mode: "markdown" | "json"
): Promise<T> {
  const command = new GetObjectCommand({
    Bucket: awsBucket,
    Key: path,
  });

  const s3Object = await s3.send(command);

  if (!s3Object.Body) {
    throw new Error(`Failed to fetch ${mode} content from S3`);
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

  let data: T;
  if (mode === "markdown") {
    const parsed = matter(fileContents);
    data = { ...parsed.data, content: parsed.content } as T;
  } else {
    // JSON
    data = JSON.parse(fileContents) as T;
  }

  return data;
}

async function getEntryBySlug<T extends MarkdownData | JSONData>(
  slug: string,
  directory: string,
  mode: "markdown" | "json",
  fields: string[] = []
): Promise<T> {
  const realSlug = slug.replace(/\.(md|json)$/, "");
  const fileExtension = mode === "markdown" ? "md" : "json";
  const path = `${directory}/${realSlug}.${fileExtension}`;
  const data = await getRawDataFromServer(path, mode);

  const items: Items = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content" && mode === "markdown") {
      items[field] = data.content;
    }
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items as T;
}

async function getAllEntries<T extends MarkdownData | JSONData>(
  directory: string,
  mode: "markdown" | "json" = "json",
  fields: string[] = []
): Promise<T[]> {
  const fileExtension = mode === "markdown" ? "md" : "json";
  const slugs = await getSlugs(directory, fileExtension);

  const entriesPromiseArray = slugs
    .filter((slug): slug is string => slug !== undefined)
    .map((slug) => getEntryBySlug<T>(slug, directory, mode, fields));

  const entries = await Promise.all(entriesPromiseArray);

  // Sort entries by date in descending order, assuming each entry has a 'date' field.
  return entries.sort((entry1, entry2) =>
    new Date(entry1.lastEditedDate || entry1.date) >
    new Date(entry2.lastEditedDate || entry2.date)
      ? -1
      : 1
  );
}

export const fetchSlugs = cache(
  async (directory: string, fileExtension: string) => {
    return await getSlugs(directory, fileExtension);
  }
);

export const fetchEntryBySlug = cache(
  async (
    slug: string,
    directory: string,
    mode: "markdown" | "json",
    fields: string[] = []
  ) => {
    return await getEntryBySlug(slug, directory, mode, fields);
  }
);

export const fetchAllEntries = cache(
  async (
    directory: string,
    mode: "markdown" | "json" = "json",
    fields: string[] = []
  ) => {
    return await getAllEntries(directory, mode, fields);
  }
);

export const revalidate = 24;
