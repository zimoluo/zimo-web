import HeaderText from "@/components/mainPage/HeaderText";
import PhotosMasonryWrapper from "./PhotosMasonryWrapper";
import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import PhotosTileWrapper from "./PhotosTileWrapper";
import PhotosWindow from "./PhotosWindow";
import PhotosTileContent from "./PhotosTileContent";

export default async function PhotosPage() {
  const allEntries = await fetchAllEntries("photos/entries", "json", [
    "title",
    "date",
    "author",
    "authorProfile",
    "slug",
    "location",
    "images",
    "instagramLink",
    "unlisted",
  ]);
  const filteredEntries = allEntries.filter(
    (entry) => !(entry as any).unlisted
  ) as unknown as PhotosEntry[];

  return (
    <>
      <HeaderText
        title="Album of Things, Album of Life."
        subtitle="Photos, just like names, comprise the soul."
      />
      <PhotosMasonryWrapper>
        {filteredEntries.map((entry, index) => (
          <PhotosTileWrapper
            url={entry.images.url[0]}
            aspectRatio={entry.images.aspectRatio}
            key={index}
            popUpWindow={<PhotosWindow {...entry} />}
            slug={entry.slug}
          >
            <PhotosTileContent {...entry} />
          </PhotosTileWrapper>
        ))}
      </PhotosMasonryWrapper>
    </>
  );
}

export const revalidate = 24;
