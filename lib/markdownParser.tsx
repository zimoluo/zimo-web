import React from "react";
import { ReactNode } from "react";
import { marked } from "marked";
import codeBoxExtraStyle from "@/styles/reading-markdown-code.module.css";
import readingStyle from "@/styles/reading-markdown.module.css";
import ImageViewer from "@/components/widgets/ImageViewer";
import ArticleCard from "@/components/widgets/ArticleCard";
import Timeline from "@/components/widgets/Timeline";
import BlogCard from "@/app/blog/BlogCard";
import ArticleCardFetcher from "@/components/widgets/ArticleCardFetcher";
import BlogCardFetcher from "@/app/blog/BlogCardFetcher";
import MusicPlayerCard from "@/components/widgets/MusicPlayerCard";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";
import markedKatex from "marked-katex-extension";
import Image from "next/image";

marked.use(markedKatex({ throwOnError: false }));

const componentsMap: { [key: string]: React.FC<any> } = {
  ImageViewer,
  ArticleCard,
  Timeline,
  BlogCard,
  ArticleCardFetcher,
  BlogCardFetcher,
  MusicPlayerCard,
  SettingsThemePicker,
  Image,
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
        dangerouslySetInnerHTML={{ __html: marked.parse(block) }}
        className={`${readingStyle["markdown"]} ${codeBoxExtraStyle["markdown"]} regular-article-module`}
      />
    );
  });
};

export default parseCustomMarkdown;
