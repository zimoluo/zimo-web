import React from "react";
import { ReactNode } from "react";
import { marked } from "marked";
import katex from "katex";
import codeBoxExtraStyle from "@/styles/reading-markdown-code.module.css";
import readingStyle from "@/styles/reading-markdown.module.css";
import ImageViewer from "@/components/widgets/ImageViewer";
import ArticleCard from "@/components/widgets/ArticleCard";
import Timeline from "@/components/widgets/Timeline";
import BlogCard from "@/app/blog/BlogCard";
import ArticleCardFetcher from "@/components/widgets/ArticleCardFetcher";

const componentsMap: { [key: string]: React.FC<any> } = {
  ImageViewer,
  ArticleCard,
  Timeline,
  BlogCard,
  ArticleCardFetcher,
};

const parseCustomComponent = (
  componentName: string,
  propsString: string,
  idx: number
): ReactNode => {
  try {
    const props = JSON.parse(`{${propsString}}`);
    const Component = componentsMap[componentName];
    return (
      <div className="my-10 font-sans" key={idx}>
        <Component {...props} />
      </div>
    );
  } catch (error) {
    console.error(
      `Failed to parse or render component ${componentName}:`,
      error
    );
    return (
      <div key={idx} style={{ color: "red" }}>
        Error rendering component {componentName}
      </div>
    );
  }
};

const parseMathAndMarkdown = (input: string): string => {
  let output = input;

  output = output.replace(
    /(?:^|[^\\])\$\$(.+?)\$\$(?:$|[^\\])/g,
    (match, p1, offset) => {
      const before = output.slice(0, offset);
      const after = output.slice(offset + match.length);
      return (
        before +
        katex.renderToString(p1, { throwOnError: false, displayMode: true }) +
        after
      );
    }
  );

  output = output.replace(
    /(?:^|[^\\])\$(.+?)\$(?:$|[^\\])/g,
    (match, p1, offset) => {
      const before = output.slice(0, offset);
      const after = output.slice(offset + match.length);
      return (
        before +
        katex.renderToString(p1, {
          throwOnError: false,
          displayMode: false,
        }) +
        after
      );
    }
  );

  output = output.replace(/\\\$/g, "$");

  return marked(output);
};

const parseCustomMarkdown = (input: string): ReactNode[] => {
  const blocks = input.split(/(&&\{\w+\}\{.+?\}&&)/g);
  return blocks.map((block, idx) => {
    const componentNameMatch = block.match(/&&\{(\w+)\}\{(.+?)\}&&/);

    if (componentNameMatch) {
      const [, componentName, propsString] = componentNameMatch;

      if (componentsMap[componentName]) {
        return parseCustomComponent(componentName, propsString, idx);
      }
    }

    return (
      <div
        key={idx}
        dangerouslySetInnerHTML={{ __html: parseMathAndMarkdown(block) }}
        className={`${readingStyle["markdown"]} ${codeBoxExtraStyle["markdown"]} regular-article-module`}
      />
    );
  });
};

export default parseCustomMarkdown;
