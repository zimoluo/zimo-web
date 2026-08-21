import type { ArticleCardDisplay } from "../../../lib/navigation-types";
export interface FilterSearchKeyword {
  title: string;
  description?: string;
  tags?: string[];
  authors?: string[];
}

export interface ImagesData {
  url: string[];
  text?: string[];
  aspectRatio: string;
  original?: string[];
}

export type HexColor = `#${string}`;

export interface ImageIconProps {
  color?: HexColor | null;
  className?: string;
  height?: number;
  width?: number;
  isLight?: boolean;
  isSaturated?: boolean;
  strokeWidth?: number;
}

export interface TOCSection {
  id: string;
  title: string;
  children?: TOCSection[];
}

export interface InputParserData<T> {
  value: T;
  setValue: (newValue: T) => void;
  isValid: (rawInput: string) => boolean;
  formatValue: (rawInput: string) => T;
}

export type ManagementArticle = ArticleCardDisplay & {
  content: string;
  slug: string;
  unlisted?: boolean;
};
