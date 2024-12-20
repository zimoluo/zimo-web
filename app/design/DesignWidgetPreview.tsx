import ExpandCollapseDisplay from "@/components/widgets/ExpandCollapseDisplay";
import BlogCardFetcher from "../blog/BlogCardFetcher";
import Timeline from "@/components/widgets/Timeline";
import ArticleCardFetcher from "@/components/widgets/ArticleCardFetcher";
import MusicPlayerCard from "@/components/widgets/MusicPlayerCard";

const widgetData = [
  {
    title: "Blog Article",
    content: <BlogCardFetcher slug="welcome-to-zimo-web" />,
  },
  {
    title: "Timeline",
    content: <Timeline events={{ "2023-10-27": "Zimo Web was released." }} />,
  },
  {
    title: "Generic Article",
    content: (
      <ArticleCardFetcher
        section="management"
        slug="understanding-website-settings"
      />
    ),
  },
  {
    title: "Music Player",
    content: (
      <MusicPlayerCard
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
