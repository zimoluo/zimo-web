import { ReactNode } from "react";
import { marked, RendererObject } from "marked";
import codeBoxExtraStyle from "./reading-markdown-code.module.css";
import readingStyle from "./reading-markdown.module.css";
import assetStyle from "./markdown-inline-asset.module.css";
import ImageViewer from "@/components/widgets/ImageViewer";
import ArticleCard from "@/components/widgets/ArticleCard";
import Timeline from "@/components/widgets/Timeline";
import BlogCard from "@/app/blog/BlogCard";
import MusicPlayerCard from "@/components/widgets/MusicPlayerCard";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";
import markedKatex from "marked-katex-extension";
import Image from "next/image";
import Link from "next/link";
import {
  inlineAssetKeywordMap,
  inlineAssetSpecialAltMap,
} from "./markdownInlineAssets";
import AccentColorEditor from "@/app/design/theme-maker/AccentColorEditor";
import GradientEditor from "@/app/design/theme-maker/GradientEditor";
import ThemeProfileSelector from "@/app/design/theme-maker/ThemeProfileSelector";
import FaviconEditorArea from "@/app/design/theme-maker/FaviconEditorArea";
import ThemeMiscEditor from "@/app/design/theme-maker/ThemeMiscEditor";
import { unescape } from "html-escaper";
import ThemeMakerSidebarButtons from "@/app/design/theme-maker/ThemeMakerSidebarButtons";

marked.use(markedKatex({ throwOnError: false }));

// should not include server-only components
const commonComponentsMap: { [key: string]: React.FC<any> } = {
  ImageViewer,
  ArticleCard,
  Timeline,
  BlogCard,
  MusicPlayerCard,
  SettingsThemePicker,
  Image,
  Link,
  themeAccent: AccentColorEditor,
  themeGradient: GradientEditor,
  themeProfile: ThemeProfileSelector,
  themeFavicon: FaviconEditorArea,
  themeMisc: ThemeMiscEditor,
  themeSidebar: ThemeMakerSidebarButtons,
};

const getUniqueId = (
  text: string,
  countMap: Record<string, number>,
  uniqueString: string = ""
): { id: string; formattedText: string } => {
  const baseId = text.toLowerCase().replace(/[^\w]+/g, "-");
  countMap[baseId] = (countMap[baseId] || 0) + 1;
  const id = countMap[baseId] > 1 ? `${baseId}-${countMap[baseId]}` : baseId;

  const processedId = uniqueString ? `${id}-${uniqueString}` : id;

  return { id: processedId, formattedText: unescape(text) };
};

const parseCustomComponent = (
  componentName: string,
  propsString: string,
  idx: number,
  componentsMap: { [key: string]: React.FC<any> } = commonComponentsMap
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
      <div key={idx} className="text-saturated">
        Error rendering component {componentName}
      </div>
    );
  }
};

const parseCustomMarkdown = (
  input: string,
  additionalComponentsMap: { [key: string]: React.FC<any> } = {},
  uniqueString?: string
): ReactNode[] => {
  const blocks = input.split(/(&&\{\w+\}\{.+?\}&&)/g);
  const componentsMap = { ...commonComponentsMap, ...additionalComponentsMap };

  const headerIdCounts: Record<string, number> = {};

  const renderer: RendererObject = {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const level = token.depth;
      const { id, formattedText } = getUniqueId(
        text,
        headerIdCounts,
        uniqueString
      );

      return `<h${level} id="${id}">${formattedText}</h${level}>`;
    },
    text(token) {
      let text = token.text || "";
      for (const keyword in inlineAssetKeywordMap) {
        const regex = new RegExp(`@@${keyword}@@`, "g");
        text = text.replace(
          regex,
          `<span class="${assetStyle.alt}">${
            inlineAssetSpecialAltMap[keyword] ??
            keyword
              .replace(/([A-Z])([a-z]+)/g, " $1$2")
              .toLowerCase()
              .trim()
          }</span><span aria-hidden="true" class="${assetStyle.asset}">${
            inlineAssetKeywordMap[keyword]
          }</span>`
        );
      }

      return text;
    },
  };

  marked.use({ renderer });

  return blocks.map((block, idx) => {
    const componentNameMatch = block.match(/&&\{(\w+)\}\{(.+?)\}&&/);

    if (componentNameMatch) {
      const [, componentName, propsString] = componentNameMatch;

      if (componentsMap[componentName]) {
        return parseCustomComponent(
          componentName,
          propsString,
          idx,
          componentsMap
        );
      }
    }

    return (
      <div
        key={idx}
        dangerouslySetInnerHTML={{ __html: marked.parse(block) }}
        className={`${readingStyle.markdown} ${codeBoxExtraStyle.markdown} regular-article-module`}
      />
    );
  });
};

export const generateTOCSectionData = (
  markdown: string,
  uniqueString?: string
): TOCSection[] => {
  const cleanMarkdown = markdown.replace(/&&\{.+\}\{.+\}&&/g, "");

  const headerIdCounts: Record<string, number> = {};
  const sections: TOCSection[] = [];
  const topLevelHeader = findTopLevelHeader(cleanMarkdown);
  let currentSection: TOCSection | null = null;
  let currentSubsection: TOCSection | null = null;

  const renderer: RendererObject = {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const level = token.depth;
      const { id, formattedText } = getUniqueId(
        text,
        headerIdCounts,
        uniqueString
      );

      const section: TOCSection = { id, title: formattedText };

      if (level === topLevelHeader) {
        currentSection = section;
        sections.push(currentSection);
      } else if (level === topLevelHeader + 1) {
        currentSubsection = section;
        if (currentSection) {
          if (!currentSection.children) currentSection.children = [];
          currentSection.children.push(currentSubsection);
        }
      } else if (level === topLevelHeader + 2) {
        if (currentSubsection) {
          if (!currentSubsection.children) currentSubsection.children = [];
          currentSubsection.children.push(section);
        }
      }

      return "";
    },
  };

  marked.use({ renderer });
  marked.parse(cleanMarkdown);

  return sections;
};

export const needTOC = (markdown: string): boolean => {
  let headerCounts = [0, 0, 0];
  const cleanMarkdown = markdown.replace(/&&\{.+\}\{.+\}&&/g, "");
  const topLevelHeader = findTopLevelHeader(cleanMarkdown);
  if (topLevelHeader > 3) {
    return false;
  }

  const renderer: RendererObject = {
    heading(token) {
      const level = token.depth;
      headerCounts[level - 1]++;
      return "";
    },
  };

  marked.use({ renderer });
  marked.parse(cleanMarkdown);

  if (headerCounts[topLevelHeader - 1] >= 2) {
    return true;
  } else if (
    headerCounts[topLevelHeader - 1] === 1 &&
    (headerCounts[topLevelHeader] >= 1 || headerCounts[topLevelHeader + 1] >= 1)
  ) {
    return true;
  }

  return false;
};

function findTopLevelHeader(markdown: string): number {
  let topLevelHeader = 4;

  const renderer: RendererObject = {
    heading(token) {
      const level = token.depth;
      topLevelHeader = Math.min(topLevelHeader, level);
      return "";
    },
  };

  marked.use({ renderer });
  marked.parse(markdown);

  return topLevelHeader;
}

export default parseCustomMarkdown;
