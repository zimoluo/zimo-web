import EntryWindowMenu from "../EntryWindowMenu";
import ManagementWindowCard from "./ManagementWindowCard";

interface Props {
  isMainPage?: boolean;
}

export default function ManagementWindowMenu({ isMainPage = false }: Props) {
  return (
    <EntryWindowMenu<PostEntry>
      isMainPage={isMainPage}
      title="Management Articles"
      entryType="about/text"
      entryFormat="markdown"
      fields={["title", "date", "slug", "content", "description", "unlisted"]}
      createKeywords={(post) => ({
        title: post.title,
        description: post.description,
      })}
      createCard={(entry) => (
        <ManagementWindowCard {...entry} key={entry.slug} />
      )}
      searchPromptKeyword="management article"
    />
  );
}
