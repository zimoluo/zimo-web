import type { ComponentSpec } from "./model/types";

export const GLYPH_NAMES = [
  "cog",
  "comment",
  "heart",
  "star",
  "bulb",
  "warning",
  "info",
  "check",
  "cross",
  "arrowRight",
  "arrowLeft",
  "download",
  "upload",
  "link",
  "lock",
  "unlock",
  "search",
  "calendar",
  "clock",
  "pin",
  "sparkle",
] as const;

export type GlyphName = (typeof GLYPH_NAMES)[number];

export const isGlyphName = (value: string): value is GlyphName =>
  (GLYPH_NAMES as readonly string[]).includes(value);

export const registry: readonly ComponentSpec[] = [
  {
    directive: "gallery",
    form: "container",
    environment: "any",
    attributes: {
      ratio: { kind: "string", default: "4:3" },
      caption: { kind: "string" },
      columns: { kind: "number", default: 1 },
    },
    example: ':::gallery{ratio="4:3"}\n![One](a.jpg)\n:::',
  },
  {
    directive: "article-card",
    form: "leaf",
    environment: "server",
    attributes: {
      section: {
        kind: "enum",
        options: ["blog", "photos", "projects", "management"],
        required: true,
      },
      slug: { kind: "string", required: true },
    },
    example: '::article-card{section="blog" slug="a-post"}',
  },
  {
    directive: "blog-card",
    form: "leaf",
    environment: "server",
    attributes: { slug: { kind: "string", required: true } },
    example: '::blog-card{slug="a-post"}',
  },
  {
    directive: "timeline",
    form: "container",
    environment: "any",
    attributes: {},
    example: ":::timeline\n- 2019 — began\n:::",
  },
  {
    directive: "music-player",
    form: "leaf",
    environment: "any",
    attributes: {
      url: { kind: "string", required: true },
      title: { kind: "string", required: true },
      author: { kind: "string" },
      cover: { kind: "string" },
    },
    example: '::music-player{url="/a.mp3" title="Local Forecast" author="Kevin MacLeod"}',
  },
  {
    directive: "theme-picker",
    form: "leaf",
    environment: "any",
    attributes: {},
    example: "::theme-picker",
  },
  {
    directive: "callout",
    form: "container",
    environment: "any",
    attributes: {
      tone: {
        kind: "enum",
        options: ["note", "warning", "danger", "success"],
        default: "note",
      },
      title: { kind: "string" },
    },
    example: ':::callout{tone="warning"}\nMind the gap.\n:::',
  },
  {
    directive: "kbd",
    form: "text",
    environment: "any",
    attributes: {},
    example: "Press :kbd[⌘K] to open the palette.",
  },
  {
    directive: "glyph",
    form: "text",
    environment: "any",
    attributes: {},
    example: "A :glyph[cog] inline.",
  },
];

const byDirective = new Map(registry.map((spec) => [spec.directive, spec]));

export const specFor = (directive: string): ComponentSpec | undefined =>
  byDirective.get(directive);

export const directiveNames: readonly string[] = registry.map((spec) => spec.directive);
