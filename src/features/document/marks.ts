import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import type { Node } from "unist";

export type MarkNode =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "emphasis"; readonly children: readonly MarkNode[] }
  | { readonly kind: "strong"; readonly children: readonly MarkNode[] }
  | { readonly kind: "code"; readonly value: string }
  | { readonly kind: "mark"; readonly children: readonly MarkNode[] }
  | { readonly kind: "strike"; readonly children: readonly MarkNode[] }
  | {
      readonly kind: "link";
      readonly href: string;
      readonly children: readonly MarkNode[];
    };

const MARK_DELIMITER = /==([^=]+)==/g;

type MdastNode = Node & {
  readonly value?: string;
  readonly url?: string;
  readonly children?: readonly MdastNode[];
};

const processor = unified().use(remarkParse).use(remarkGfm);

function splitMarkSyntax(nodes: readonly MdastNode[]): MdastNode[] {
  const out: MdastNode[] = [];

  for (const node of nodes) {
    if (node.type !== "text" || typeof node.value !== "string") {
      out.push(
        node.children === undefined
          ? node
          : ({ ...node, children: splitMarkSyntax(node.children) } as MdastNode),
      );
      continue;
    }

    const value = node.value;
    let cursor = 0;
    MARK_DELIMITER.lastIndex = 0;

    for (;;) {
      const match = MARK_DELIMITER.exec(value);
      if (match === null) break;

      if (match.index > cursor) {
        out.push({ type: "text", value: value.slice(cursor, match.index) });
      }
      out.push({
        type: "zwMark",
        children: [{ type: "text", value: match[1] ?? "" }],
      } as MdastNode);
      cursor = match.index + match[0].length;
    }

    if (cursor < value.length) out.push({ type: "text", value: value.slice(cursor) });
  }

  return out;
}

const childrenOf = (node: MdastNode): readonly MdastNode[] => node.children ?? [];

function convert(nodes: readonly MdastNode[]): MarkNode[] {
  const out: MarkNode[] = [];

  for (const node of nodes) {
    const children = childrenOf(node);

    switch (node.type) {
      case "text":
        out.push({ kind: "text", value: node.value ?? "" });
        break;
      case "emphasis":
        out.push({ kind: "emphasis", children: convert(children) });
        break;
      case "strong":
        out.push({ kind: "strong", children: convert(children) });
        break;
      case "inlineCode":
        out.push({ kind: "code", value: node.value ?? "" });
        break;
      case "delete":
        out.push({ kind: "strike", children: convert(children) });
        break;
      case "zwMark":
        out.push({ kind: "mark", children: convert(children) });
        break;
      case "link":
        out.push({ kind: "link", href: node.url ?? "", children: convert(children) });
        break;
      default: {
        if (children.length > 0) out.push(...convert(children));
        else if (typeof node.value === "string") out.push({ kind: "text", value: node.value });
        break;
      }
    }
  }

  return out;
}

export function parseMarks(input: string, options: { readonly preserveBlocks?: boolean } = {}): readonly MarkNode[] {
  const tree = processor.parse(input) as MdastNode;

  if (options.preserveBlocks === true) {
    const nodes: MdastNode[] = [];
    let previous = 0;
    for (const block of tree.children ?? []) {
      const start = block.position?.start.offset ?? previous;
      if (start > previous) nodes.push({ type: "text", value: input.slice(previous, start) });
      nodes.push(...(block.children ?? [{ type: "text", value: block.value ?? "" }]));
      previous = block.position?.end.offset ?? start;
    }
    if (previous < input.length) nodes.push({ type: "text", value: input.slice(previous) });
    return convert(splitMarkSyntax(nodes));
  }
  const inline: MdastNode[] = [];
  visit(tree as Node, "paragraph", (node: Node) => {
    inline.push(...((node as MdastNode).children ?? []));
  });

  if (inline.length === 0) {
    return input.trim().length === 0 ? [] : [{ kind: "text", value: input }];
  }

  return convert(splitMarkSyntax(inline));
}

export function stripMarks(input: string): string {
  const walk = (nodes: readonly MarkNode[]): string =>
    nodes
      .map((node) => {
        switch (node.kind) {
          case "text":
          case "code":
            return node.value;
          default:
            return walk(node.children);
        }
      })
      .join("");

  return walk(parseMarks(input));
}
