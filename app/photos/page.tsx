import HeaderText from "@/components/mainPage/HeaderText";
import PhotosMasonryWrapper from "./PhotosMasonryWrapper";
import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import PhotosTileWrapper from "./PhotosTileWrapper";
import PhotosWindow from "./PhotosWindow";
import PhotosTileContent from "./PhotosTileContent";
import masonryStyle from "./masonry.module.css";
import PhotosModeSwitch from "./PhotosModeSwitch";
import PhotosModeApplier from "./PhotosModeApplier";
import PhotosGalleryDisplay from "./PhotosGalleryDisplay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album - Zimo Web",
  description: "The personal display of photos of Zimo.",
};

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
      <div className="w-full flex justify-center items-center">
        <div
          className={`${masonryStyle["masonry-width"]} flex justify-end items-center -translate-y-14 md:-translate-y-20 -mb-9 md:-mb-12`}
        >
          <PhotosModeSwitch />
        </div>
      </div>
      <PhotosModeApplier
        entry={
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
        }
        gallery={
          <PhotosMasonryWrapper>
            {filteredEntries.map((entry, index) =>
              entry.images.url.map((photoUrl, photoIndex) => (
                <PhotosGalleryDisplay
                  key={photoIndex}
                  url={photoUrl}
                  aspectRatio={entry.images.aspectRatio}
                  title={entry.title}
                  text={(entry.images.text || [""])[photoIndex] || ""}
                />
              ))
            )}
          </PhotosMasonryWrapper>
        }
      />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none h-16"
      />
    </>
  );
}

export const revalidate = 24;
