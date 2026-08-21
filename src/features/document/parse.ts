import "server-only";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { toText } from "hast-util-to-text";
import type { Root as HastRoot } from "hast";
import { remarkComponents } from "./plugins/remark-components";
import { remarkLegacyGlyphs } from "./plugins/remark-legacy-glyphs";
import { remarkHeadingIds, remarkOutline } from "./plugins/remark-outline";
import type {
  DocumentIssue,
  OutlineSection,
  ParseOptions,
  ParsedDocument,
} from "./model/types";
import { WORDS_PER_MINUTE } from "./model/types";
import { collectLegacyGlyphIssues } from "./legacy-glyph-issues";

export function countWords(plainText: string): number {
  const trimmed = plainText.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

export function readingMinutesFor(plainText: string): number {
  const words = countWords(plainText);
  return words === 0 ? 0 : Math.ceil(words / WORDS_PER_MINUTE);
}

export async function parseDocument(
  markdown: string,
  options: ParseOptions = {},
): Promise<ParsedDocument> {
  const issues: DocumentIssue[] = [];
  const outline: OutlineSection[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkDirective)
    .use(remarkLegacyGlyphs)
    .use(() => (tree) => collectLegacyGlyphIssues(tree, issues))
    .use(() => remarkComponents(issues))
    .use(() => remarkHeadingIds(options.idNamespace))
    .use(() => remarkOutline(outline))
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeKatex, { output: "mathml" })
    .use(rehypeHighlight, { detect: false, ignoreMissing: true });

  const mdast = processor.parse(markdown);
  const document = (await processor.run(mdast)) as HastRoot;

  const plainText = toText(document, { whitespace: "normal" });

  return {
    document,
    outline,
    plainText,
    readingMinutes: readingMinutesFor(plainText),
    issues,
  };
}
