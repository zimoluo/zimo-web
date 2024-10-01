import EntryWindowMenu from "../EntryWindowMenu";
import PhotosWindowCard from "./PhotosWindowCard";

interface Props {
  isMainPage?: boolean;
}

export default function PhotosWindowMenu({ isMainPage = false }: Props) {
  return (
    <EntryWindowMenu<PhotosEntry>
      isMainPage={isMainPage}
      title="Album Posts"
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
      createKeywords={(post) => ({
        title: post.title,
        authors: [post.author],
      })}
      createCard={(entry) => <PhotosWindowCard {...entry} key={entry.slug} />}
      cardHeight="10rem"
      searchPromptKeyword="album post"
    />
  );
}
