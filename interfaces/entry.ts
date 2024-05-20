interface FilterSearchKeyword {
  title: string;
  description?: string;
  tags?: string[];
  authors?: string[];
}

interface ImagesData {
  url: string[];
  text?: string[];
  aspectRatio: string;
  original?: string[];
}

type HexColor = `#${string}`;

interface ImageIconProps {
  color?: HexColor | null;
  className?: string;
  height?: number;
  width?: number;
  isLight?: boolean;
  isSaturated?: boolean;
  strokeWidth?: number;
}

interface TOCSection {
  id: string;
  title: string;
  children?: TOCSection[];
}

type MakeOptional<T> = {
  [K in keyof T]?: T[K];
};

interface InputParserData<T> {
  value: T;
  setValue: (newValue: T) => void;
  isValid: (rawInput: string) => boolean;
  formatValue: (rawInput: string) => T;
}
