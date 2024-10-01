import EntryWindowMenu from "../EntryWindowMenu";
import BlogWindowCard from "./BlogWindowCard";

interface Props {
  isMainPage?: boolean;
}

export default function BlogWindowMenu({ isMainPage = false }: Props) {
  return (
    <EntryWindowMenu<PostEntry>
      isMainPage={isMainPage}
      title="Blog Articles"
      entryType="blog/text"
      entryFormat="markdown"
      fields={[
        "title",
        "date",
        "slug",
        "author",
        "content",
        "coverImage",
        "description",
        "authorId",
        "lastEditedDate",
        "tags",
        "unlisted",
      ]}
      createKeywords={(post) => ({
        title: post.title,
        description: post.description,
        tags: post.tags,
        authors: [post.author],
      })}
      createCard={(entry) => (
        <BlogWindowCard {...entry} key={entry.slug} showTags={true} />
      )}
      cardHeight="16rem"
    />
  );
}
