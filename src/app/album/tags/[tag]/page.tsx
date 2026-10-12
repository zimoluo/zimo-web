import { EntryList } from "@/src/features/entries";
import { loadSummaries } from "@/src/server/entries/load";
import { loadAlbumCounts } from "@/src/server/comments/load-album-counts";
export default async function Page({ params }: { readonly params: Promise<{ tag: string }> }) { const tag = decodeURIComponent((await params).tag); const entries = (await loadSummaries("album")).filter((entry) => entry.tags.some((candidate) => candidate.toLowerCase() === tag.toLowerCase())); return <EntryList reactionCounts={await loadAlbumCounts()} section="album" title={`Tag: ${tag}`} entries={entries} />; }
