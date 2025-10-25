import BlogWindowReader from "./BlogWindowReader";
import { getCoverSrc } from "@/lib/blog/helper";
import blogWindowStyle from "./blog-window.module.css";
import EntryWindowLoader from "../EntryWindowLoader";

interface Props {
  slug: string;
}

export default function BlogWindowLoader({ slug }: Props) {
  return (
    <EntryWindowLoader<PostEntry>
      slug={slug}
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
        "displayCover",
        "tags",
        "lastEditedDate",
        "compatibleCover",
        "unlisted",
      ]}
      modifyEntry={(entry) => ({
        ...entry,
        coverImage: getCoverSrc(entry.coverImage, entry.slug) || "data:null;,",
      })}
      renderContent={(post) => (
        <div className={`${blogWindowStyle.padding} pt-16 pb-8 relative`}>
          <BlogWindowReader {...post} />
        </div>
      )}
    />
  );
}
