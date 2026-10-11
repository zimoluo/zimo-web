import type {CSSProperties} from "react";
import type {ImageProps} from "next/image";
export default function PaletteImage({src,className,style,width,height}:ImageProps) {
 const image=typeof src==="string"?{src,width:0,height:0}:"default" in src?src.default:src;
 const dimensions:CSSProperties={aspectRatio:image.width>0&&image.height>0?`${image.width} / ${image.height}`:undefined,...style};
 return <img src={image.src} data-palette-src={image.src} width={width??(image.width||undefined)} height={height??(image.height||undefined)} alt="" aria-hidden="true" draggable={false} className={className} style={dimensions}/>;
}
