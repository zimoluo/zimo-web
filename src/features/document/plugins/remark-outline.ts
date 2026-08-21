import { visit } from "unist-util-visit";
import type { Node } from "unist";
import type { OutlineSection } from "../model/types";

type HeadingNode = Node & {
  readonly type: "heading";
  readonly depth: number;
  children?: Node[];
  data?: Record<string, unknown>;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const textOf = (node: Node): string => {
  let out = "";
  visit(node, (child: Node) => {
    const value = (child as { value?: unknown }).value;
    if (typeof value === "string") out += value;
  });
  return out;
};

export function remarkHeadingIds(namespace: string | undefined) {
  const suffix = namespace === undefined || namespace === "" ? "" : `-${slugify(namespace)}`;

  return (tree: Node): void => {
    const used = new Map<string, number>();

    visit(tree, "heading", (node: Node) => {
      const heading = node as HeadingNode;
      const text = textOf(heading);
      const base = slugify(text) || "section";

      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);

      const id = seen === 0 ? `${base}${suffix}` : `${base}-${seen}${suffix}`;

      const data = (heading.data ?? {}) as Record<string, unknown>;
      const properties = (data.hProperties ?? {}) as Record<string, unknown>;
      heading.data = { ...data, hProperties: { ...properties, id } };
    });
  };
}

export function remarkOutline(outline: OutlineSection[]) {
  return (tree: Node): void => {
    visit(tree, "heading", (node: Node) => {
      const heading = node as HeadingNode;
      const properties = (heading.data?.hProperties ?? {}) as { id?: unknown };
      const id = typeof properties.id === "string" ? properties.id : "";
      outline.push({ id, depth: heading.depth, text: textOf(heading) });
    });
  };
}
