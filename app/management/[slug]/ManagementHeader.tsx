import { calendarDate } from "@/lib/dateUtil";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";

export default function ManagementHeader({
  title,
  description,
  date,
}: ArticleCardDisplay) {
  return (
    <>
      <h1 className="font-bold text-4xl text-primary leading-relaxed">
        {title}
      </h1>
      <h3 className="text-xl mt-1">{calendarDate(date)}</h3>
      {description && (
        <p className="text-xl text-saturated opacity-80 mt-4">
          {enrichTextContent(description)}
        </p>
      )}
    </>
  );
}
