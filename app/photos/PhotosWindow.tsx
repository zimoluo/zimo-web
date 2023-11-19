import WindowDisplay from "@/components/widgets/WindowDisplay";
import windowStyle from "./photos-window.module.css";
import PhotosTitleCard from "./PhotosTitleCard";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import { CommentProvider } from "@/components/contexts/CommentContext";
import { getComments } from "@/lib/dataLayer/server/commentManager";
import EntryLikeButtonInitializer from "@/components/comments/EntryLikeButtonInitializer";
import PhotosWindowTypingBarPlacer from "./PhotosWindowTypingBarPlacer";

export default async function PhotosWindow(entry: PhotosEntry) {
  return (
    <div className="w-screen h-screen inset-0 flex items-center justify-center">
      <div className={`${windowStyle.size}`}>
        <CommentProvider
          location={`photos/comments/${entry.slug}.json`}
          initialComments={await getComments(
            `photos/comments/${entry.slug}.json`
          )}
        >
          <WindowDisplay
            imageData={entry.images}
            display={
              <div className="flex flex-col min-h-full">
                <article className="w-full px-4 pt-4 pb-4 mb-2">
                  <PhotosTitleCard {...entry} />
                  <div className="border-saturated border-opacity-80 border-t-0.8 -mt-10 mb-8 -mx-4 select-none pointer-events-none" />
                  <CommentAreaWrapper>
                    <CommentCardContainer />
                  </CommentAreaWrapper>
                </article>
                <div
                  className="flex-grow pointer-events-none select-none"
                  aria-hidden="true"
                />
                <PhotosWindowTypingBarPlacer
                  likeButton={
                    <EntryLikeButtonInitializer
                      resourceLocation={`photos/likedBy/${entry.slug}.json`}
                    />
                  }
                ></PhotosWindowTypingBarPlacer>
              </div>
            }
          />
        </CommentProvider>
      </div>
    </div>
  );
}
