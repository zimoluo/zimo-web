import WindowDisplay from "@/components/widgets/WindowDisplay";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import { CommentProvider } from "@/components/contexts/CommentContext";
import PhotosTitleCard from "@/app/photos/PhotosTitleCard";
import PhotosCommentTypingBar from "@/app/photos/PhotosCommentTypingBar";
import EntryLikeButton from "@/components/comments/EntryLikeButton";
import EntryWindowLoader from "../EntryWindowLoader";

interface Props {
  slug: string;
}

export default function PhotosWindowLoader({ slug }: Props) {
  return (
    <EntryWindowLoader<PhotosEntry>
      slug={slug}
      entryType="photos/entries"
      entryFormat="json"
      fields={[
        "title",
        "date",
        "author",
        "authorProfile",
        "slug",
        "location",
        "images",
        "instagramLink",
        "unlisted",
      ]}
      renderContent={(entry) => (
        <CommentProvider
          location={`photos/comments/${entry.slug}.json`}
          likeIconType="heart"
        >
          <WindowDisplay
            className="bg-widget-90"
            imageData={entry.images}
            display={
              <div className="flex flex-col min-h-full">
                <article className="w-full px-4 pt-4 pb-4 mb-2">
                  <PhotosTitleCard {...entry} shiftInstagramButton={true} />
                  <hr className="border-saturated border-opacity-80 border-t-0.8 -mt-10 mb-8 -mx-4 select-none pointer-events-none" />
                  <CommentAreaWrapper>
                    <CommentCardContainer />
                  </CommentAreaWrapper>
                </article>
                <div
                  className="flex-grow pointer-events-none select-none"
                  aria-hidden="true"
                />
                <div className="sticky bottom-0 w-full">
                  <PhotosCommentTypingBar
                    inMiddle={false}
                    likeButton={
                      <EntryLikeButton
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
      )}
    />
  );
}
