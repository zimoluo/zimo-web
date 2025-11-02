import WindowDisplay from "@/components/widgets/WindowDisplay";
import PhotosTitleCard from "./PhotosTitleCard";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import { CommentProvider } from "@/components/contexts/CommentContext";
import { getComments } from "@/lib/dataLayer/server/commentManager";
import EntryLikeButtonInitializer from "@/components/comments/EntryLikeButtonInitializer";
import PhotosCommentTypingBar from "./PhotosCommentTypingBar";
import windowStyle from "./photos-window.module.css";

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
          likeIconType="heart"
        >
          <WindowDisplay
            className="bg-widget-80"
            imageData={entry.images}
            display={
              <div className="flex flex-col min-h-full">
                <article className="w-full px-2 pt-2 mb-2 flex-grow">
                  <div className="rounded-3xl border border-highlight-light/15 bg-light/65 p-4 shadow">
                    <PhotosTitleCard {...entry} />
                  </div>
                  <CommentAreaWrapper>
                    <div
                      className={`${windowStyle.commentContainer} mt-2 rounded-3xl border border-highlight-light/15 bg-light/65 p-4 shadow h-full`}
                    >
                      <CommentCardContainer />
                    </div>
                  </CommentAreaWrapper>
                </article>
                <div className="sticky bottom-0 w-full pb-2 px-2">
                  <PhotosCommentTypingBar
                    inMiddle={false}
                    likeButton={
                      <EntryLikeButtonInitializer
                        resourceLocation={`photos/likedBy/${entry.slug}.json`}
                        likeIconType="heart"
                      />
                    }
                  />
                </div>
              </div>
            }
          />
        </CommentProvider>
      </div>
    </div>
  );
}
