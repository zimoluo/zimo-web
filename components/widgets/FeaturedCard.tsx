import { calendarDate } from "@/lib/dateUtil";
import Link from "next/link";
import Image from "next/image";
import { sectionMap } from "./ArticleCard";

type Props = ArticleCardProps & {
  className?: string;
  isLessRounded?: boolean;
  thumbnailUrl?: string;
};

export default function FeaturedCard({
  title,
  section,
  slug,
  description,
  date,
  thumbnailUrl,
  className = "",
}: Props) {
  return (
    <Link href={`/${section}/${slug}`}>
      <div
        className={`rounded-2xl outline outline-1 outline-highlight-light/15 shadow-lg bg-light/65 h-28 md:h-32 ${className}`}
      >
        <div className="flex gap-4 pt-2 pl-4 pr-2 pb-2 w-full h-full">
          <div className="flex-grow flex flex-col pt-1 md:pt-1.5 gap-1">
            <h3 className="text-lg font-bold">{title}</h3>
            {description && (
              <p className="hidden md:block text-base opacity-90">
                {description}
              </p>
            )}
            <div className="flex-grow w-0 pointer-events-none select-none" />
            <div className="text-sm font-bold whitespace-nowrap">
              {`${
                date ? `${calendarDate(date)}${"  ·  "}` : ""
              }${sectionMap[section]}`}
            </div>
          </div>
          {thumbnailUrl && (
            <div className="shrink-0 h-full aspect-square rounded-lg border-reflect-light">
              <Image
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover rounded-lg shadow-sm"
                width={400}
                height={400}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
