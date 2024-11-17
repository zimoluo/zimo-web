import Image from "next/image";
import { getProjectFavicon } from "@/lib/projects/helper";

interface Props {
  slug: string;
  faviconFormat: string;
  title: string;
}

export default function ProjectsTileContent({
  slug,
  faviconFormat,
  title,
}: Props) {
  return (
    <>
      <Image
        height={32}
        width={32}
        src={getProjectFavicon(slug, faviconFormat)}
        className="h-12 md:h-20 w-auto transition-transform ease-in duration-200 group-hover:scale-110 opacity-90 drop-shadow-lg"
        alt={title}
      />
      <p className="absolute top-26 md:top-40 left-1/2 -translate-x-1/2 w-44 text-center font-bold text-saturated transition-all text-sm md:text-base ease-in duration-200 opacity-60 md:opacity-0 md:group-hover:opacity-60 md:group-hover:top-38">
        {title}
      </p>
    </>
  );
}
