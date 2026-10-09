import type { Metadata } from "next";
import { EntryList } from "@/src/features/entries";
import { loadSummaries } from "@/src/server/entries/load";
export const metadata: Metadata = { title: "Album - Zimo Web" };
export default async function Page() { return <EntryList entries={await loadSummaries("album")} section="album" title="Album" />; }
