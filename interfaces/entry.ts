interface FilterSearchKeyword {
  title: string;
  description?: string;
  tags?: string[];
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
}

interface TOCSection {
  id: string;
  title: string;
  children?: TOCSection[];
}
