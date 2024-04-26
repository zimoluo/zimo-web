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
}

interface TOCSection {
  id: string;
  title: string;
  children?: TOCSection[];
}

type AllowedImageFormat = "jpeg" | "png" | "svg" | "webp";
