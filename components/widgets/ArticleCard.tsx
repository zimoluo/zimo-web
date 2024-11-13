import { calendarDate, formatDate } from "@/lib/dateUtil";
import Link from "next/link";

type Props = ArticleCardProps & {
  className?: string;
};

const sectionMap: { [key: string]: string } = {
  photos: "Album",
  blog: "Blog",
  projects: "Projects",
  management: "Management",
};

export const sectionMethodMap: Record<EntrySection, "markdown" | "json"> = {
  blog: "markdown",
  management: "markdown",
  photos: "json",
  projects: "json",
};

export const sectionDirectoryMap: Record<EntrySection, string> = {
  blog: "blog/text",
  management: "about/text",
  photos: "photos/entries",
  projects: "projects/entries",
};

export default function ArticleCard({
  title,
  section,
  slug,
  description,
  date,
  className = "",
  useCalendarDate = false,
  omitSectionType = false,
}: Props) {
  return (
    <Link href={`/${section}/${slug}`}>
      <div
        className={`px-4 pt-4 pb-7 rounded-xl backdrop-blur-2xl shadow-lg bg-widget-70 relative ${className}`}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        {description && <p className="text-base opacity-90">{description}</p>}
        <div className="absolute bottom-1 right-2.5 text-sm font-bold">
          {`${
            date
              ? `${useCalendarDate ? calendarDate(date) : formatDate(date)}${
                  omitSectionType ? "" : "  ·  "
                }`
              : ""
          }${omitSectionType ? "" : sectionMap[section]}`}
        </div>
      </div>
    </Link>
  );
}
