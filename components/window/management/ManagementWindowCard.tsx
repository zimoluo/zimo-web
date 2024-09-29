import { useEntryWindow } from "@/components/contexts/EntryWindowContext";
import { calendarDate } from "@/lib/dateUtil";

type Props = Omit<ArticleCardProps, "section"> & {
  className?: string;
};

export default function ManagementWindowCard({
  title,
  slug,
  description,
  date,
  className = "",
}: Props) {
  const { setSlug, setIsMenuOpen } = useEntryWindow();

  return (
    <button
      className={`px-4 pt-4 pb-7 rounded-xl backdrop-blur-lg shadow-lg bg-widget-70 relative w-full text-start ${className}`}
      onClick={() => {
        setSlug(slug);
        setIsMenuOpen(false);
      }}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      {description && <p className="text-base opacity-90">{description}</p>}
      <div className="absolute bottom-1 right-2.5 text-sm font-bold">
        {date ? `${calendarDate(date)}` : ""}
      </div>
    </button>
  );
}
