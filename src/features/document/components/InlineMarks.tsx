import { Fragment } from "react";
import type { ReactNode } from "react";
import { parseMarks } from "../marks";
import type { MarkNode } from "../marks";

const renderNodes = (nodes: readonly MarkNode[]): ReactNode =>
  nodes.map((node, index) => (
    <Fragment key={index}>{renderNode(node)}</Fragment>
  ));

function renderNode(node: MarkNode): ReactNode {
  switch (node.kind) {
    case "text":
      return node.value;
    case "emphasis":
      return <em>{renderNodes(node.children)}</em>;
    case "strong":
      return <strong>{renderNodes(node.children)}</strong>;
    case "code":
      return <code className="font-mono">{node.value}</code>;
    case "mark":
      return <mark>{renderNodes(node.children)}</mark>;
    case "strike":
      return <s>{renderNodes(node.children)}</s>;
    case "link":
      return (
        <a
          href={node.href}
          className="underline underline-offset-2"
          rel={isExternal(node.href) ? "noopener noreferrer" : undefined}
          target={isExternal(node.href) ? "_blank" : undefined}
        >
          {renderNodes(node.children)}
        </a>
      );
  }
}

const isExternal = (href: string): boolean =>
  href.startsWith("http://") || href.startsWith("https://");

export function InlineMarks({ children }: { readonly children: string }) {
  return <>{renderNodes(parseMarks(children))}</>;
}
