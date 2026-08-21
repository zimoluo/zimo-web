import { visit } from "unist-util-visit";
import type { Node, Parent } from "unist";
import { isGlyphName } from "../registry";
import { specFor } from "../registry";
import type { AttributeSpec, DocumentIssue, DirectiveForm } from "../model/types";

type DirectiveNode = Node & {
  readonly type: "containerDirective" | "leafDirective" | "textDirective";
  readonly name: string;
  attributes?: Record<string, string | null | undefined>;
  children?: Node[];
  data?: Record<string, unknown>;
};

const FORM_OF: Readonly<Record<string, DirectiveForm>> = {
  containerDirective: "container",
  leafDirective: "leaf",
  textDirective: "text",
};

const positionOf = (node: Node): { line?: number; column?: number } => {
  const start = node.position?.start;
  return start === undefined ? {} : { line: start.line, column: start.column };
};

function coerce(
  name: string,
  spec: AttributeSpec,
  raw: string | null | undefined,
  directive: string,
  node: Node,
  issues: DocumentIssue[],
): string | number | boolean | undefined {
  const missing = raw === undefined || raw === null;

  if (missing) {
    if ("required" in spec && spec.required === true) {
      issues.push({
        severity: "error",
        code: "attribute-required",
        message: `${directive}: "${name}" is required`,
        ...positionOf(node),
      });
      return undefined;
    }
    if (spec.kind === "boolean") return spec.default ?? false;
    return "default" in spec ? spec.default : undefined;
  }

  switch (spec.kind) {
    case "string":
      return raw;

    case "number": {
      const value = Number.parseFloat(raw);
      if (!Number.isFinite(value)) {
        issues.push({
          severity: "error",
          code: "attribute-type",
          message: `${directive}: "${name}" expects a number, got "${raw}"`,
          ...positionOf(node),
        });
        return spec.default;
      }
      return value;
    }

    case "boolean":
      return raw === "" || raw === "true";

    case "enum": {
      if (!spec.options.includes(raw)) {
        issues.push({
          severity: "error",
          code: "attribute-enum",
          message: `${directive}: "${name}" expects one of ${spec.options.join(", ")}, got "${raw}"`,
          ...positionOf(node),
        });
        return spec.default;
      }
      return raw;
    }
  }
}

export function remarkComponents(issues: DocumentIssue[]) {
  return (tree: Node): void => {
    visit(tree, (node: Node, index, parent) => {
      const form = FORM_OF[node.type];
      if (form === undefined) return;

      const directive = node as DirectiveNode;
      const spec = specFor(directive.name);

      if (spec === undefined) {
        issues.push({
          severity: "warning",
          code: "unknown-directive",
          message: `Unknown directive ":${directive.name}"; rendered as plain text`,
          ...positionOf(node),
        });
        return;
      }

      if (spec.form !== form) {
        issues.push({
          severity: "error",
          code: "directive-form",
          message: `":${directive.name}" is a ${spec.form} directive, used as ${form}`,
          ...positionOf(node),
        });
        return;
      }

      const attributes = directive.attributes ?? {};
      const props: Record<string, string | number | boolean> = {};

      for (const [name, attributeSpec] of Object.entries(spec.attributes)) {
        const value = coerce(name, attributeSpec, attributes[name], directive.name, node, issues);
        if (value !== undefined) props[name] = value;
      }

      for (const name of Object.keys(attributes)) {
        if (name in spec.attributes) continue;
        if (name === "id" || name === "class") continue;
        issues.push({
          severity: "warning",
          code: "attribute-unknown",
          message: `${directive.name}: unknown attribute "${name}"`,
          ...positionOf(node),
        });
      }

      if (directive.name === "glyph") {
        const label = (directive.children ?? [])
          .map((child) => (child as { value?: string }).value ?? "")
          .join("");
        if (!isGlyphName(label)) {
          issues.push({
            severity: "warning",
            code: "unknown-glyph",
            message: `Unknown glyph "${label}"`,
            ...positionOf(node),
          });
        }
        props.name = label;
      }

      directive.data = {
        ...(directive.data ?? {}),
        hName: `zw-${directive.name}`,
        hProperties: props,
      };

      void index;
      void (parent as Parent | undefined);
    });
  };
}
