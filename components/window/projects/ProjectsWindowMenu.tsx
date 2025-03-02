import EntryWindowMenu from "../EntryWindowMenu";
import ProjectsWindowCard from "./ProjectsWindowCard";

interface Props {
  isMainPage?: boolean;
}

export default function ProjectsWindowMenu({ isMainPage = false }: Props) {
  return (
    <EntryWindowMenu<ProjectsEntry>
      isMainPage={isMainPage}
      title="Project Entries"
      entryType="projects/entries"
      entryFormat="json"
      fields={[
        "title",
        "slug",
        "description",
        "links",
        "date",
        "authors",
        "faviconFormat",
        "content",
        "images",
        "unlisted",
      ]}
      createKeywords={(post) => ({
        title: post.title,
        authors: post.authors,
      })}
      createCard={(entry) => <ProjectsWindowCard {...entry} key={entry.slug} />}
      searchPromptKeyword="project"
    />
  );
}
