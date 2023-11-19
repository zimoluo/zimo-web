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

type ImageViewerProps = ImagesData & {
  useHFull?: boolean;
  defaultGridView?: boolean;
  forceGridViewCenter?: boolean;
};
