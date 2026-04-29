import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import { sectionDirectoryMap, sectionMethodMap } from "./ArticleCard";
import FeaturedCard from "./FeaturedCard";
import { getProjectFavicon } from "@/lib/projects/helper";

export default async function FeaturedCardFetcher({
  section,
  slug,
  className = "",
}: ArticleCardData & { className?: string }) {
  const thumbnailFields = (() => {
    switch (section) {
      case "blog":
        return ["coverImage"];
      case "photos":
        return ["images"];
      case "projects":
        return ["faviconFormat"];
      default:
        return [];
    }
  })();

  const entryData = (await fetchEntryBySlug(
    slug,
    sectionDirectoryMap[section],
    sectionMethodMap[section],
    [...["title", "description", "date", "lastEditedDate"], ...thumbnailFields],
  )) as ArticleCardDisplay & {
    lastEditedDate?: string;
    faviconFormat?: string;
    coverImage?: string;
    images?: ImagesData;
  };
  const { title, description, date, lastEditedDate } = entryData;
  const thumbnailUrl = (() => {
    switch (section) {
      case "blog":
        return entryData.coverImage || undefined;
      case "photos":
        return entryData.images?.url[0] || undefined;
      case "projects":
        return entryData.faviconFormat
          ? getProjectFavicon(slug, entryData.faviconFormat)
          : undefined;
      default:
        return undefined;
    }
  })();

  return (
    <FeaturedCard
      section={section}
      slug={slug}
      title={title}
      description={description || ""}
      date={lastEditedDate || date}
      thumbnailUrl={thumbnailUrl}
      className={className}
    />
  );
}
