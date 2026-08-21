import type { ReactNode } from "react";
import { GLYPH_NAMES } from "../registry";

export type GlyphProps = { readonly name?: string };

const LABELS: Readonly<Record<string, string>> = {
  arrowRight: "arrow right",
  arrowLeft: "arrow left",
};

const labelFor = (name: string): string =>
  LABELS[name] ?? name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();

const PATHS: Readonly<Record<string, string>> = {
  cog: "M12 8a4 4 0 100 8 4 4 0 000-8zm8.9 4a8.9 8.9 0 01-.1 1.3l2 1.6-2 3.4-2.4-1a9 9 0 01-2.2 1.3L15.8 22h-3.9l-.4-2.4a9 9 0 01-2.2-1.3l-2.4 1-2-3.4 2-1.6a9 9 0 010-2.6l-2-1.6 2-3.4 2.4 1a9 9 0 012.2-1.3L11.9 2h3.9l.4 2.4a9 9 0 012.2 1.3l2.4-1 2 3.4-2 1.6c.06.43.1.86.1 1.3z",
  comment: "M4 4h16v12H8l-4 4V4z",
  heart: "M12 21s-8-5.2-8-10.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 3.5C20 15.8 12 21 12 21z",
  star: "M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 17.8 5.7 21.2 7 14.2 2 9.4l7-.9L12 2z",
  bulb: "M9 21h6v-1H9v1zm3-19a7 7 0 00-4 12.7V18h8v-3.3A7 7 0 0012 2z",
  warning: "M12 2l10 18H2L12 2zm-1 7v5h2V9h-2zm0 7v2h2v-2h-2z",
  info: "M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z",
  check: "M4 13l5 5L20 7l-2-2-9 9-3-3-2 2z",
  cross: "M5 5l14 14M19 5L5 19",
  arrowRight: "M4 12h14l-5-5 1.5-1.5L22 12l-7.5 6.5L13 17l5-5H4z",
  arrowLeft: "M20 12H6l5-5L9.5 5.5 2 12l7.5 6.5L11 17l-5-5h14z",
  download: "M12 3v10l4-4 1.5 1.5L12 17l-5.5-6.5L8 9l4 4V3zM4 19h16v2H4z",
  upload: "M12 21V11l-4 4L6.5 13.5 12 7l5.5 6.5L16 15l-4-4v10zM4 3h16v2H4z",
  link: "M9 15l6-6M8 12H6a3 3 0 010-6h4M16 12h2a3 3 0 010 6h-4",
  lock: "M6 10V8a6 6 0 1112 0v2h1v11H5V10h1zm2 0h8V8a4 4 0 10-8 0v2z",
  unlock: "M6 10h13v11H5V10h1V8a6 6 0 0111-3l-1.7 1A4 4 0 008 8v2z",
  search: "M10 4a6 6 0 104 10.5l5 5L20.5 18l-5-5A6 6 0 0010 4z",
  calendar: "M4 5h16v16H4V5zm2 5v9h12v-9H6zM8 2v3H6V2h2zm10 0v3h-2V2h2z",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5l4 2-1 1.7-5-3V7h2z",
  pin: "M12 2a6 6 0 016 6c0 4.5-6 14-6 14S6 12.5 6 8a6 6 0 016-6zm0 4a2 2 0 100 4 2 2 0 000-4z",
  sparkle: "M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6zM19 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z",
};

export function Glyph({ name = "" }: GlyphProps): ReactNode {
  const path = PATHS[name];

  if (path === undefined) {
    return <span data-zw-unknown-glyph={name}>{`:${name}:`}</span>;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      role="img"
      aria-label={labelFor(name)}
      focusable="false"
      style={{ display: "inline-block", verticalAlign: "-0.125em" }}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}

export const glyphNames = GLYPH_NAMES;
