import { Suspense } from "react";
import Link from "next/link";
import { EntryCard } from "@/src/features/entries";
import { loadSummaries } from "@/src/server/entries/load";
import ExpandCollapseDisplay from "@/src/features/document/components/DisclosureList";
import { AudioPlayer } from "@/src/features/media";

const widgetData = [
  {
    title: "Blog Article",
    content: <Suspense fallback={<p role="status">Loading article preview…</p>}><BlogPreview /></Suspense>,
  },
  {
    title: "Music Player",
    content: (
      <AudioPlayer
        url="https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/audio/local-forecast-elevator.mp3"
        title="Local Forecast - Elevator"
        author="Kevin MacLeod"
        coverUrl="https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/audio/disco-ultralounge.jpeg"
      />
    ),
  },
];

export default function DesignWidgetPreview() {
  return (
    <ExpandCollapseDisplay
      entries={widgetData.map((widget) => ({
        title: widget.title,
        content: <div className="px-1 md:px-4">{widget.content}</div>,
      }))}
    />
  );
}

async function BlogPreview() {
  const entries = await loadSummaries("blog").catch(() => []);
  const entry = entries.find(item => item.slug === "welcome-to-zimo-web") ?? entries[0];
  return entry ? <EntryCard entry={entry} /> : <p>The article preview is unavailable. <Link href="/blog" className="underline underline-offset-2">Visit the blog</Link>.</p>;
}
