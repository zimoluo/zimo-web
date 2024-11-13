import Image from "next/image";
import { useEntryWindow } from "@/components/contexts/EntryWindowContext";
import { calendarDate } from "@/lib/dateUtil";
import { getProjectFavicon } from "@/lib/projects/helper";

export default function ProjectsWindowCard(entry: ProjectsEntry) {
  const { setSlug, setIsMenuOpen, slug: currentSlug } = useEntryWindow();

  return (
    <button
      className="w-full group text-start shadow-lg rounded-xl overflow-hidden"
      onClick={() => {
        if (entry.slug !== currentSlug) {
          setSlug(entry.slug);
        }
        setIsMenuOpen(false);
      }}
    >
      <div className="w-full h-20 px-4 py-3 backdrop-blur-2xl bg-widget-70 relative font-bold">
        <div className="absolute top-1/2 -translate-y-1/2 -right-8">
          <Image
            src={getProjectFavicon(entry.slug, entry.faviconFormat)}
            height={200}
            width={200}
            alt="Project favicon of "
            className="h-48 w-auto aspect-square touch-none select-none opacity-75"
          />
        </div>
        <div className="flex flex-col h-full">
          <p className="relative text-lg">{entry.title}</p>
          <div className="relative flex-grow flex items-end">
            <p className="text-sm">{`${entry.authors.join(
              ", "
            )}  ·  ${calendarDate(entry.date)}`}</p>
          </div>
        </div>
      </div>
    </button>
  );
}
