import { parse, format, compareAsc } from "date-fns";
import timelineStyle from "./timeline.module.css";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";

interface Props {
  events: Record<string, string>;
  sorted?: boolean;
}

const formatDate = (dateStr: string) => {
  const date = parse(dateStr, "yyyy-M-d", new Date());
  return format(date, "MMMM d, yyyy");
};

export default function Timeline({ events, sorted = true }: Props) {
  const formattedEvents = sorted
    ? Object.entries(events).sort((a, b) => {
        const dateA = parse(a[0], "yyyy-M-d", new Date());
        const dateB = parse(b[0], "yyyy-M-d", new Date());
        return compareAsc(dateB, dateA);
      })
    : Object.entries(events);

  return (
    <figure className="relative -mx-4 px-4 -my-4 py-4 overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2" />
      {formattedEvents.map(([date, text], index) => (
        <div key={index} className="relative left-5 mr-5">
          <div
            className={`absolute h-full w-0.5 bg-saturated top-0 ${timelineStyle.bar}`}
          />
          <div className="absolute w-6 h-6 bg-light border-2 border-saturated rounded-full -left-5 top-8" />
          <div className="pt-4 pl-4">
            <div className="bg-light/65 outline outline-1 outline-highlight-light/15 shadow-lg p-4 rounded-xl ml-2">
              <h3 className="font-bold mb-2 text-lg">{formatDate(date)}</h3>
              <p className="text-base">{enrichTextContent(text)}</p>
            </div>
          </div>
        </div>
      ))}
    </figure>
  );
}
