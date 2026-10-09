import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import type { Node } from "unist";

export type MigrationChange = {
  readonly kind: string;
  readonly from: string;
  readonly to: string;
  readonly line?: number | undefined;
};

export type MigrationIssue = {
  readonly kind: string;
  readonly message: string;
  readonly line?: number | undefined;
};

export type MigrationResult = {
  readonly markdown: string;
  readonly changes: readonly MigrationChange[];
  readonly issues: readonly MigrationIssue[];
};

const COMPONENT_BLOCK = /&&\{(\w+)\}\{([\s\S]*?)\}&&/g;

const REMOVED_DIRECTIVES = new Set([
  "themeAccent",
  "themeGradient",
  "themeProfile",
  "themeFavicon",
  "themeMisc",
  "themeSidebar",
]);

const lineOf = (source: string, index: number): number =>
  source.slice(0, index).split("\n").length;

const quote = (value: unknown): string =>
  `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

const attributesFrom = (props: Readonly<Record<string, unknown>>, skip: readonly string[]): string => {
  const pairs = Object.entries(props)
    .filter(([key, value]) => !skip.includes(key) && value !== undefined && value !== null)
    .filter(([, value]) => typeof value !== "object")
    .map(([key, value]) =>
      typeof value === "boolean" ? (value ? key : null) : `${key}=${quote(value)}`,
    )
    .filter((pair): pair is string => pair !== null);

  return pairs.length === 0 ? "" : `{${pairs.join(" ")}}`;
};

const asStringArray = (value: unknown): readonly string[] =>
  Array.isArray(value) ? value.map((entry) => String(entry)) : [];

function convertComponent(
  name: string,
  props: Readonly<Record<string, unknown>>,
): string | null {
  switch (name) {
    case "ImageViewer": {
      const urls = asStringArray(props.url);
      const captions = asStringArray(props.text);
      if (urls.length === 0) return null;

      const images = urls.map((url, index) => {
        const caption = captions.length === urls.length ? (captions[index] ?? "") : "";
        return `![${caption}](${url})`;
      });

      const attributes = attributesFrom(props, ["url", "text", "original"]);
      return [`:::gallery${attributes}`, ...images, ":::"].join("\n");
    }

    case "Timeline": {
      const events = props.events;
      if (typeof events !== "object" || events === null) return null;

      const items = Object.entries(events as Record<string, unknown>).map(
        ([when, what]) => `- ${when} — ${String(what)}`,
      );
      const attributes = attributesFrom(props, ["events"]);
      return [`:::timeline${attributes}`, ...items, ":::"].join("\n");
    }

    case "ArticleCardFetcher":
    case "ArticleCardClientReader":
    case "ArticleCard":
      return `::article-card${attributesFrom({ ...props, section: props.section === "photos" ? "album" : props.section }, [])}`;

    case "BlogCardFetcher":
    case "BlogCard":
      return `::blog-card${attributesFrom(props, [])}`;

    case "MusicPlayerCard":
      return `::music-player${attributesFrom(props, [])}`;

    case "SettingsThemePicker":
      return "::theme-picker";

    case "Image": {
      const src = props.src ?? props.url;
      if (src === undefined) return null;
      return `![${String(props.alt ?? props.caption ?? "")}](${String(src)})`;
    }

    case "Link": {
      const href = props.href ?? props.url;
      if (href === undefined) return null;
      return `[${String(props.text ?? props.label ?? href)}](${String(href)})`;
    }

    default:
      return null;
  }
}

const GLYPH_TOKEN = /@@([A-Za-z][A-Za-z0-9]*)@@/g;
const V10_MAIL = /@@\{([^{}]*)\}\{([^{}]*)\}@@/g;
const V10_LINK = /~~\{([^{}]*)\}\{([^{}]*)\}~~/g;
const V10_MARK = /\|([^|\n]+)\|/g;
const V10_STRONG = /(^|[^*])\*([^*\n]+)\*(?!\*)/g;

export function migrateInlineMarks(input: string): MigrationResult {
  const changes: MigrationChange[] = [];
  let output = input;

  output = output.replace(V10_MAIL, (whole, text: string, address: string) => {
    const next = `[${text}](mailto:${address})`;
    changes.push({ kind: "mark-mailto", from: whole, to: next });
    return next;
  });

  output = output.replace(V10_LINK, (whole, text: string, url: string) => {
    const next = `[${text}](${url})`;
    changes.push({ kind: "mark-link", from: whole, to: next });
    return next;
  });

  output = output.replace(V10_MARK, (whole, text: string) => {
    const next = `==${text}==`;
    changes.push({ kind: "mark-highlight", from: whole, to: next });
    return next;
  });

  output = output.replace(V10_STRONG, (whole, lead: string, text: string) => {
    const next = `${lead}**${text}**`;
    changes.push({ kind: "mark-strong", from: whole, to: next });
    return next;
  });

  output = output.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, (whole, lead: string, content: string) => {
    const next = `${lead}*${content}*`; changes.push({ kind: "mark-emphasis", from: whole, to: next }); return next;
  });
  return { markdown: output, changes, issues: [] };
}

export function migrateDocument(markdown: string, options: { readonly legacyMarks?: boolean } = {}): MigrationResult {
  const changes: MigrationChange[] = [];
  const issues: MigrationIssue[] = [];

  COMPONENT_BLOCK.lastIndex = 0;
  const prose = rewriteProse(markdown, options.legacyMarks === true, changes);
  const output = prose.replace(
    COMPONENT_BLOCK,
    (whole, name: string, propsBody: string, offset: number) => {
      const line = lineOf(markdown, offset);

      if (REMOVED_DIRECTIVES.has(name)) {
        changes.push({ kind: "directive-removed", from: whole, to: "", line });
        return "";
      }

      let props: Record<string, unknown>;
      try {
        props = JSON.parse(`{${propsBody}}`) as Record<string, unknown>;
      } catch {
        issues.push({
          kind: "unparseable-props",
          message: `${name}: props are not valid JSON; left in place for review`,
          line,
        });
        return whole;
      }

      const converted = convertComponent(name, props);
      if (converted === null) {
        issues.push({
          kind: "unconvertible",
          message: `${name}: no conversion rule matched these props; left in place`,
          line,
        });
        return whole;
      }

      changes.push({ kind: `directive-${name}`, from: whole, to: converted, line });
      return converted;
    },
  );

  return { markdown: output, changes, issues };
}

function rewriteProse(markdown: string, legacyMarks: boolean, changes: MigrationChange[]): string {
  const ranges: [number, number][] = [];
  const tree = unified().use(remarkParse).use(remarkDirective).parse(markdown);
  const walk = (node: Node & { children?: readonly Node[] }): void => {
    const from = node.position?.start.offset, to = node.position?.end.offset;
    if (from !== undefined && to !== undefined && ["code", "inlineCode", "html", "definition", "image"].includes(node.type)) { ranges.push([from,to]); return; }
    if (from !== undefined && to !== undefined && ["containerDirective", "leafDirective", "textDirective"].includes(node.type)) {
      const start = markdown.indexOf("{",from), end = markdown.indexOf("}",start);
      if (start >= from && end < to && end >= start) ranges.push([start,end+1]);
    }
    for (const child of node.children ?? []) walk(child);
  };
  walk(tree);
  for (const match of markdown.matchAll(COMPONENT_BLOCK)) ranges.push([match.index,match.index + match[0].length]);
  ranges.sort((a,b) => a[0]-b[0]);
  const merged: [number,number][] = [];
  for (const range of ranges) { const last = merged[merged.length-1]; if (last !== undefined && range[0] <= last[1]) last[1] = Math.max(last[1],range[1]); else merged.push([...range]); }
  const rewrite = (source: string, offset: number): string => {
    let result = source;
    if (legacyMarks) { const migrated = migrateInlineMarks(result); changes.push(...migrated.changes); result = migrated.markdown; }
    return result.replace(GLYPH_TOKEN, (whole, name: string, at: number) => { const next = `:glyph[${name}]`; changes.push({kind:"glyph",from:whole,to:next,line:lineOf(markdown,offset+at)}); return next; });
  };
  let cursor = 0, result = "";
  for (const [from,to] of merged) { result += rewrite(markdown.slice(cursor,from),cursor) + markdown.slice(from,to); cursor = to; }
  return result + rewrite(markdown.slice(cursor),cursor);
}
