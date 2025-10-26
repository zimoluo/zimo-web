import WindowDisplay from "@/components/widgets/WindowDisplay";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import { CommentProvider } from "@/components/contexts/CommentContext";
import PhotosTitleCard from "@/app/photos/PhotosTitleCard";
import PhotosCommentTypingBar from "@/app/photos/PhotosCommentTypingBar";
import EntryLikeButton from "@/components/comments/EntryLikeButton";
import EntryWindowLoader from "../EntryWindowLoader";
import photosWindowStyle from "@/app/photos/photos-window.module.css";

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
                <article className="w-full px-2 pt-2 mb-2">
                  <div className="rounded-3xl border border-highlight-light/15 bg-light/65 p-4 shadow">
                    <PhotosTitleCard {...entry} shiftInstagramButton={true} />
                  </div>
                  <CommentAreaWrapper>
                    <div
                      className={`mt-2 rounded-3xl border border-highlight-light/15 bg-light/65 p-4 shadow ${photosWindowStyle.commentContainer}`}
                    >
                      <CommentCardContainer />
                    </div>
                  </CommentAreaWrapper>
                </article>
                <div
                  className="flex-grow pointer-events-none select-none"
                  aria-hidden="true"
                />
                <div className="sticky bottom-0 w-full pb-2 px-2">
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
