import TOCSettingApplier from "@/components/widgets/TOCSettingApplier";
import TableOfContents from "@/components/widgets/TableOfContents";
import { calendarDate } from "@/lib/dateUtil";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { generateTOCSectionData } from "@/lib/markdownParser";
import tocStyle from "@/components/widgets/toc.module.css";

export default function ManagementHeader({
  title,
  description,
  date,
  content,
}: ArticleCardDisplay & { content: string }) {
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
      <TOCSettingApplier>
        <div
          className={`mt-6 -mb-2 ${tocStyle["in-area-placement"]} overflow-y-auto`}
        >
          <TableOfContents
            sections={generateTOCSectionData(content)}
            className={`${tocStyle.intext}`}
          />
        </div>
      </TOCSettingApplier>
    </>
  );
}
