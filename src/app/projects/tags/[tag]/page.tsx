import { EntryList } from "@/src/features/entries";
import { loadSummaries } from "@/src/server/entries/load";
export default async function Page({ params }: { readonly params: Promise<{ tag: string }> }) { const tag = decodeURIComponent((await params).tag); const entries = (await loadSummaries("projects")).filter((entry) => entry.tags.some((candidate) => candidate.toLowerCase() === tag.toLowerCase())); return <EntryList section="projects" title={`Tag: ${tag}`} entries={entries} />; }
