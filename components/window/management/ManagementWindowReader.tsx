"use client";

import parseCustomMarkdown, {
  generateTOCSectionData,
} from "@/lib/markdownParser";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import ShareButtonArray from "@/components/widgets/ShareButtonArray";
import clientWindowMarkdownComponentsMap from "@/lib/clientWindowMarkdownComponentsMap";
import WindowReadingSettingsApplier from "../WindowReadingSettingsApplier";
import TOCSettingApplier from "@/components/widgets/TOCSettingApplier";
import TOCExistChecker from "@/components/widgets/TOCExistChecker";
import TableOfContents from "@/components/widgets/TableOfContents";
import tocStyle from "@/components/widgets/toc.module.css";
import { useWindowAction } from "@/components/contexts/WindowActionContext";
import { getFullMarkdown } from "@/lib/downloadEntry";
import { calendarDate } from "@/lib/dateUtil";

export default function ManagementWindowReader(post: ManagementArticle) {
  const { uniqueId } = useWindowAction();

  return (
    <>
      <div className="absolute top-4 right-4">
        <ShareButtonArray
          title={post.title}
          description={getFullMarkdown(
            post.content,
            post.title,
            post.date,
            post.description
          )}
          slug={post.slug}
          section="management"
          platforms={["download"]}
          useMobileShare={false}
        />
      </div>
      <h1 className="font-bold text-4xl text-primary leading-relaxed">
        {post.title}
      </h1>
      <h3 className="text-xl mt-1">{calendarDate(post.date)}</h3>
      {post.description && (
        <p className="text-xl text-saturated opacity-80 mt-4">
          {enrichTextContent(post.description)}
        </p>
      )}
      <TOCSettingApplier>
        <TOCExistChecker markdown={post.content}>
          <div className="mt-6 -mb-2">
            <TableOfContents
              sections={generateTOCSectionData(post.content, uniqueId)}
              className={`${tocStyle.intext}`}
            />
          </div>
        </TOCExistChecker>
      </TOCSettingApplier>
      <hr className="my-10 border-saturated border-t opacity-50" />
      <WindowReadingSettingsApplier slug={post.slug}>
        {parseCustomMarkdown(
          post.content,
          clientWindowMarkdownComponentsMap,
          uniqueId
        )}
      </WindowReadingSettingsApplier>
    </>
  );
}
