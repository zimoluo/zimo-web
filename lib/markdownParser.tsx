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

const documentIdFilter = /[^\w]+/g;

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
      <div className="my-10 font-main" key={idx}>
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

  const renderer = new marked.Renderer();
  const headerIdCounts: Record<string, number> = {};

  renderer.heading = (text, level) => {
    const baseId = text.toLowerCase().replace(/[^\w]+/g, "-");
    headerIdCounts[baseId] = (headerIdCounts[baseId] || 0) + 1;
    const id =
      headerIdCounts[baseId] > 1
        ? `${baseId}-${headerIdCounts[baseId]}`
        : baseId;

    return `<h${level} id="${id}">${text}</h${level}>`;
  };

  marked.use({ renderer });

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

export const generateTOCSectionData = (markdown: string): TOCSection[] => {
  const cleanMarkdown = markdown.replace(/&&\{.+\}\{.+\}&&/g, "");

  const renderer = new marked.Renderer();
  const headerIdCounts: Record<string, number> = {};
  const sections: TOCSection[] = [];
  let currentSection: TOCSection | null = null;
  let currentSubsection: TOCSection | null = null;

  renderer.heading = (text, level) => {
    const baseId = text.toLowerCase().replace(/[^\w]+/g, "-");
    headerIdCounts[baseId] = (headerIdCounts[baseId] || 0) + 1;
    const id =
      headerIdCounts[baseId] > 1
        ? `${baseId}-${headerIdCounts[baseId]}`
        : baseId;

    const section: TOCSection = { id, title: text };

    if (level === 1) {
      currentSection = section;
      sections.push(currentSection);
    } else if (level === 2) {
      currentSubsection = section;
      if (currentSection) {
        if (!currentSection.children) currentSection.children = [];
        currentSection.children.push(currentSubsection);
      }
    } else if (level === 3) {
      if (currentSubsection) {
        if (!currentSubsection.children) currentSubsection.children = [];
        currentSubsection.children.push(section);
      }
    }

    return "";
  };

  marked.use({ renderer });

  marked.parse(cleanMarkdown);

  return sections;
};

export const hasTopHeader = (markdown: string): boolean => {
  let foundH1 = false;
  const cleanMarkdown = markdown.replace(/&&\{.+\}\{.+\}&&/g, "");

  const renderer = new marked.Renderer();

  renderer.heading = (text, level) => {
    if (level === 1) {
      foundH1 = true;
    }
    return "";
  };

  marked.use({ renderer });

  marked.parse(cleanMarkdown);

  return foundH1;
};

export default parseCustomMarkdown;
