import ManagementWindowReader from "./ManagementWindowReader";
import blogWindowStyle from "../blog/blog-window.module.css";
import EntryWindowLoader from "../EntryWindowLoader";

interface Props {
  slug: string;
}

export default function ManagementWindowLoader({ slug }: Props) {
  return (
    <EntryWindowLoader<ManagementArticle>
      slug={slug}
      entryType="about/text"
      entryFormat="markdown"
      fields={["title", "date", "slug", "content", "description", "unlisted"]}
      renderContent={(entry) => (
        <div className={`${blogWindowStyle.padding} pt-14 pb-8 relative`}>
          <ManagementWindowReader {...entry} />
        </div>
      )}
    />
  );
}
