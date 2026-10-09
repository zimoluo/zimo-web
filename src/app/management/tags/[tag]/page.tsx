import { EntryList } from "@/src/features/entries";
import { loadSummaries } from "@/src/server/entries/load";
export default async function Page({ params }: { readonly params: Promise<{ tag: string }> }) { const tag = decodeURIComponent((await params).tag); const entries = (await loadSummaries("management")).filter((entry) => entry.tags.some((candidate) => candidate.toLowerCase() === tag.toLowerCase())); return <EntryList section="management" title={`Tag: ${tag}`} entries={entries} />; }
