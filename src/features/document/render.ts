import type { ReactNode } from "react";
import { Fragment, createElement } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Components } from "hast-util-to-jsx-runtime";
import type { DocumentNode } from "./model/types";
import { Glyph } from "./components/Glyph";

export type Surface = "server" | "client";

type UnknownProps = Readonly<Record<string, unknown>> & {
  readonly children?: ReactNode;
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

const Gallery = ({ ratio, caption, columns, children }: UnknownProps): ReactNode =>
  createElement(
    "figure",
    {
      className: "zw-gallery",
      "data-ratio": String(ratio ?? "4:3"),
      style: { "--zw-gallery-columns": String(columns ?? 1) } as never,
    },
    children,
    caption === undefined ? null : createElement("figcaption", null, String(caption)),
  );

const Timeline = ({ children }: UnknownProps): ReactNode =>
  createElement("div", { className: "zw-timeline" }, children);

const MusicPlayer = ({ url, title, author }: UnknownProps): ReactNode =>
  createElement(
    "figure",
    { className: "zw-music-player surface-nested" },
    createElement("figcaption", null, `${String(title)}${author === undefined ? "" : ` — ${String(author)}`}`),
    createElement("audio", { controls: true, src: String(url), preload: "none" }),
  );

const ServerOnlyPlaceholder = (directive: string) => {
  const Placeholder = (): ReactNode =>
    createElement("div", {
      className: "zw-server-placeholder",
      "data-directive": directive,
      "aria-busy": "true",
    });
  Placeholder.displayName = `ServerOnly(${directive})`;
  return Placeholder;
};

export function buildRegistry(surface: Surface): Components {
  const serverOnly = (directive: string, component: (props: UnknownProps) => ReactNode) =>
    surface === "server" ? component : ServerOnlyPlaceholder(directive);

  return {
    "zw-glyph": Glyph as never,
    "zw-kbd": Kbd as never,
    "zw-callout": Callout as never,
    "zw-gallery": Gallery as never,
    "zw-timeline": Timeline as never,
    "zw-music-player": MusicPlayer as never,
    "zw-theme-picker": (() =>
      createElement("div", { className: "zw-theme-picker", "data-placeholder": "true" })) as never,
    "zw-article-card": serverOnly("article-card", ({ section, slug }) =>
      createElement("div", {
        className: "zw-article-card surface-raised",
        "data-section": String(section),
        "data-slug": String(slug),
      }),
    ) as never,
    "zw-blog-card": serverOnly("blog-card", ({ slug }) =>
      createElement("div", {
        className: "zw-blog-card surface-raised",
        "data-slug": String(slug),
      }),
    ) as never,
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
  });
}
