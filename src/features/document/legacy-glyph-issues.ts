import { visit } from "unist-util-visit";
import type { Node } from "unist";
import type { DocumentIssue } from "./model/types";

type LegacyGlyphNode = Node & {
  readonly data?: { readonly legacyGlyph?: boolean };
  readonly children?: readonly { readonly value?: string }[];
};

export function collectLegacyGlyphIssues(tree: Node, issues: DocumentIssue[]): void {
  visit(tree, "textDirective", (node: Node) => {
    const directive = node as LegacyGlyphNode;
    if (directive.data?.legacyGlyph !== true) return;

    const label = (directive.children ?? [])
      .map((child) => child.value ?? "")
      .join("");

    const start = node.position?.start;

    issues.push({
      severity: "deprecated",
      code: "legacy-glyph",
      message: `@@${label}@@ is the v10 glyph syntax; write :glyph[${label}] instead`,
      line: start?.line,
      column: start?.column,
    });
  });
}
