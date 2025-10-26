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
  const { setSlug, setIsMenuOpen, slug: currentSlug } = useEntryWindow();

  return (
    <button
      className={`px-4 pt-4 pb-7 rounded-3xl backdrop-blur-[6px] shadow-lg bg-light/65 outline outline-1 outline-highlight-light/15 relative w-full text-start ${className}`}
      onClick={() => {
        if (slug !== currentSlug) {
          setSlug(slug);
        }
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
