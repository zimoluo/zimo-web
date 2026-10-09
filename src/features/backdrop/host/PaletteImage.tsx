import type { CSSProperties } from "react";
import type { ImageProps } from "next/image";


export default function PaletteImage({ src, className, style, width, height }: ImageProps) {
  const image = typeof src === "string" ? { src, width: 0, height: 0 } : "default" in src ? src.default : src;
  const maskStyle: CSSProperties = {
    display: "inline-block",
    width: width || (className === undefined ? image.width || undefined : undefined),
    height: height || (className === undefined ? image.height || undefined : undefined),
    aspectRatio: image.width > 0 && image.height > 0 ? `${image.width} / ${image.height}` : undefined,
    backgroundColor: "var(--zw-scene-highlight)",
    maskImage: `url("${image.src}")`,
    maskSize: className?.includes("object-cover") ? "cover" : "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    ...style,
  };
  return <span aria-hidden="true" className={className} style={maskStyle} />;
}
