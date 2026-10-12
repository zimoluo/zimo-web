import type { Metadata } from "next";
import { EntryList } from "@/src/features/entries";
import { loadSummaries } from "@/src/server/entries/load";
import { loadAlbumCounts } from "@/src/server/comments/load-album-counts";
export const metadata: Metadata = { title: "Album - Zimo Web" };
export default async function Page() { const [entries, reactionCounts] = await Promise.all([loadSummaries("album"), loadAlbumCounts()]); return <EntryList entries={entries} reactionCounts={reactionCounts} section="album" title="Album" />; }
