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
import { storageClient } from "@/src/server/storage/sender";
import { cache } from "react";
import { notFound } from "next/navigation";

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

const s3 = storageClient();

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

export class MissingEntryError extends Error {
  readonly key: string;

  constructor(key: string) {
    super(`No entry at ${key}`);
    this.name = "MissingEntryError";
    this.key = key;
  }
}

function isMissingObjectError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const named = error as { name?: unknown; $metadata?: { httpStatusCode?: unknown } };
  return (
    named.name === "NoSuchKey" ||
    named.name === "NotFound" ||
    named.$metadata?.httpStatusCode === 404
  );
}

/**
 * The raw AWS fetch function without cache or formatted path. Only used for custom cases.
 */
export async function getRawDataFromServer<T extends MarkdownData | JSONData>(
  path: string,
  mode: "markdown" | "json",
): Promise<T> {
  const command = new GetObjectCommand({
    Bucket: awsBucket,
    Key: path,
  });

  let s3Object;
  try {
    s3Object = await s3.send(command);
  } catch (error) {
    if (isMissingObjectError(error)) {
      throw new MissingEntryError(path);
    }
    throw error;
  }

  if (!s3Object.Body) {
    throw new Error(`Failed to fetch ${mode} content from S3`);
  }

  let fileContents = "";
  const isGzipped = s3Object.ContentEncoding === "gzip";

  await pipeline(
    s3Object.Body as Readable,
    isGzipped ? zlib.createGunzip() : (source) => source,
    async function* (source: any) {
      for await (const chunk of source) {
        fileContents += chunk.toString("utf-8");
      }
    },
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
  fields: string[] = [],
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
  fields: string[] = [],
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
      : 1,
  );
}

export const fetchSlugs = cache(
  async (directory: string, fileExtension: string) => {
    return await getSlugs(directory, fileExtension);
  },
);

export const fetchEntryBySlug = cache(
  async (
    slug: string,
    directory: string,
    mode: "markdown" | "json",
    fields: string[] = [],
  ) => {
    try {
      return await getEntryBySlug(slug, directory, mode, fields);
    } catch (error) {
      if (error instanceof MissingEntryError) {
        notFound();
      }
      throw error;
    }
  },
);

export const fetchAllEntries = cache(
  async (
    directory: string,
    mode: "markdown" | "json" = "json",
    fields: string[] = [],
  ) => {
    return await getAllEntries(directory, mode, fields);
  },
);

export const revalidate = 24;
