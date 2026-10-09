import type { Metadata } from "next";
import { ArticleView } from "@/src/features/entries";
import { loadEntry } from "@/src/server/entries/load";
type Props = { readonly params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = await loadEntry("album", (await params).slug);
  return { title: `${entry.title} | Album - Zimo Web`, description: entry.description, robots: { index: !entry.unlisted, follow: !entry.unlisted }, openGraph: { title: entry.title, type: "article", images: entry.cover === undefined ? [] : [{ url: entry.cover.src, width: entry.cover.width, height: entry.cover.height, alt: entry.cover.alt }] } };
}
export default async function Page({ params }: Props) { return <ArticleView entry={await loadEntry("album", (await params).slug)} />; }
