import WindowDisplay from "@/components/widgets/WindowDisplay";
import PhotosTitleCard from "./PhotosTitleCard";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import { CommentProvider } from "@/components/contexts/CommentContext";
import { getComments } from "@/lib/dataLayer/server/commentManager";
import EntryLikeButtonInitializer from "@/components/comments/EntryLikeButtonInitializer";
import PhotosCommentTypingBar from "./PhotosCommentTypingBar";

export default async function PhotosWindow(entry: PhotosEntry) {
  const [widthRatio, heightRatio] = entry.images.aspectRatio
    .split(":")
    .map(Number);

  return (
    <div className="w-screen h-screen inset-0 flex items-center justify-center">
      <div
        style={{
          height: `clamp(20vh, ${
            (52 / widthRatio) * heightRatio
          }vw, min(calc(100vh - 6rem), ${(65 / widthRatio) * heightRatio}vh))`,
          width: "clamp(10rem, 90vw, 114vh)",
        }}
      >
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
                  <hr className="border-saturated border-opacity-80 border-t-0.8 -mt-10 mb-8 -mx-4 select-none pointer-events-none" />
                  <CommentAreaWrapper>
                    <CommentCardContainer />
                  </CommentAreaWrapper>
                </article>
                <div
                  className="flex-grow pointer-events-none select-none"
                  aria-hidden="true"
                />
                <CommentAreaWrapper>
                  <div className="sticky bottom-0 w-full">
                    <PhotosCommentTypingBar
                      inMiddle={false}
                      likeButton={
                        <EntryLikeButtonInitializer
                          resourceLocation={`photos/likedBy/${entry.slug}.json`}
                        />
                      }
                    />
                  </div>
                </CommentAreaWrapper>
              </div>
            }
          />
        </CommentProvider>
      </div>
    </div>
  );
}
