import type { Metadata } from "next";
import { EntryList } from "@/src/features/entries";
import { loadSummaries } from "@/src/server/entries/load";
export const metadata: Metadata = { title: "Management - Zimo Web" };
export default async function Page() { return <EntryList entries={await loadSummaries("management")} section="management" title="Management" />; }
