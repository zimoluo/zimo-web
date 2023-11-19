import {
  fetchAllEntries,
  fetchEntryBySlug,
} from "@/lib/dataLayer/server/awsEntryFetcher";
import { ReactNode } from "react";
import PhotosWindow from "../PhotosWindow";

interface Props {
  children?: ReactNode;
  params: { slug: string };
}

const fetchDir = "photos/entries";

export const revalidate = 24;

export default async function PhotosEntryLayout({ params, children }: Props) {
  const { slug } = params;

  const entry = (await fetchEntryBySlug(slug, fetchDir, "json", [
    "title",
    "date",
    "author",
    "authorProfile",
    "slug",
    "location",
    "images",
    "instagramLink",
  ])) as PhotosEntry;

  return <PhotosWindow {...entry} />;
}

export async function generateStaticParams() {
  const entries = await fetchAllEntries(fetchDir, "json", ["slug"]);

  return entries.map((entry) => {
    return {
      slug: entry.slug as string,
    };
  });
}
