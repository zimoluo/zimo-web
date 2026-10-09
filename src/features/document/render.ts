import type { ReactNode } from "react";
import type { Element } from "hast";
import { ImageViewer, mediaImageSchema, type MediaImage } from "../media";
import { Fragment, createElement } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Components } from "hast-util-to-jsx-runtime";
import type { DocumentNode } from "./model/types";
import { DirectiveCard } from "./components/DirectiveCard";
import { ThemePicker } from "./components/ThemePicker";
import { Glyph } from "./components/Glyph";
import { DocumentMusicPlayer } from "./components/DocumentMusicPlayer";

export type Surface = "server" | "client";

type UnknownProps = Readonly<Record<string, unknown>> & {
  readonly children?: ReactNode;
  readonly node?: Element;
};

const Kbd = ({ children }: UnknownProps): ReactNode =>
  createElement("kbd", { className: "zw-kbd" }, children);

const Callout = ({ tone, title, children }: UnknownProps): ReactNode =>
  createElement(
    "aside",
    { className: "zw-callout surface-nested surface-edge", "data-tone": String(tone ?? "note") },
    title === undefined ? null : createElement("p", { className: "zw-callout-title" }, String(title)),
    children,
  );

const imageOf = (properties: Readonly<Record<string, unknown>>): MediaImage | null => {
  const parsed = mediaImageSchema.safeParse({ ...properties, width: Number(properties.width), height: Number(properties.height), alt: typeof properties.alt === "string" ? properties.alt : "" });
  return parsed.success ? parsed.data : null;
};
const imagePropertiesIn = (node: Element | undefined): readonly Readonly<Record<string, unknown>>[] => node === undefined ? [] : node.children.flatMap((child) => {
  if (child.type !== "element") return [];
  if (child.tagName === "img") return [child.properties];
  return imagePropertiesIn(child);
});
const DocumentImage = (props: UnknownProps): ReactNode => {
  const properties = props.node?.properties ?? props;
  const image = imageOf(properties);
  if (image !== null) return createElement(ImageViewer, { images: [image], priority: false });
  const src = typeof properties.src === "string" ? properties.src : "";
  const alt = typeof properties.alt === "string" && properties.alt !== "" ? properties.alt : "View image";
  return src === "" ? createElement("span", null, alt) : createElement("a", { href: src, target: "_blank", rel: "noopener noreferrer", className: "underline" }, alt);
};
const Paragraph = ({ children, node }: UnknownProps): ReactNode => createElement(node?.children.some((child) => child.type === "element" && child.tagName === "img") ? "div" : "p", null, children);
const Gallery = ({ ratio, caption, columns, children, node }: UnknownProps): ReactNode => {
  const properties = imagePropertiesIn(node);
  const images = properties.flatMap((properties) => { const image = imageOf(properties); return image === null ? [] : [image]; });
  return createElement("figure", { className: "zw-gallery", "data-ratio": String(ratio ?? "4:3"), style: { "--zw-gallery-columns": images.length === 0 ? String(columns ?? 1) : "1" } as never },
    images.length === 0 || images.length !== properties.length ? children : createElement(ImageViewer, { images, priority: false }),
    caption === undefined ? null : createElement("figcaption", null, String(caption)));
};

const Timeline = ({ children }: UnknownProps): ReactNode =>
  createElement("div", { className: "zw-timeline" }, children);

const MusicPlayer = ({url,title,author}:UnknownProps):ReactNode => createElement(DocumentMusicPlayer,{url:String(url),title:String(title),...(author===undefined?{}:{author:String(author)})});

export function buildRegistry(_surface: Surface): Components {
  return {
    img: DocumentImage as never,
    p: Paragraph as never,
    "zw-glyph": Glyph as never,
    "zw-kbd": Kbd as never,
    "zw-callout": Callout as never,
    "zw-gallery": Gallery as never,
    "zw-timeline": Timeline as never,
    "zw-music-player": MusicPlayer as never,
    "zw-theme-picker": ThemePicker as never,
    "zw-article-card": DirectiveCard as never,
    "zw-blog-card": ((props: UnknownProps) => createElement(DirectiveCard, { slug: props.slug, section: "blog" })) as never,
  } as Components;
}

export type DocumentViewProps = {
  readonly document: DocumentNode;
  readonly surface?: Surface;
  readonly components?: Components;
};

export function renderDocument({
  document,
  surface = "server",
  components,
}: DocumentViewProps): ReactNode {
  return toJsxRuntime(document, {
    Fragment,
    jsx: jsx as never,
    jsxs: jsxs as never,
    components: components ?? buildRegistry(surface),
    passNode: true,
  });
}
