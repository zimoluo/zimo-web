import ExpandCollapseDisplay from "@/src/features/document/components/DisclosureList";
import { AudioPlayer } from "@/src/features/media";

const widgetData = [
  {
    title: "Blog Article",
    content: <div className="surface-widget rounded-2xl p-6"><h3 className="text-2xl">A story to share</h3><p className="mt-3">A preview of a text widget in the current theme.</p></div>,
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
