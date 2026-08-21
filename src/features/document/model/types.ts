import type { Root as HastRoot } from "hast";

export type DocumentNode = HastRoot;

export type IssueSeverity = "error" | "warning" | "deprecated";

export type DocumentIssue = {
  readonly severity: IssueSeverity;
  readonly code: string;
  readonly message: string;
  readonly line?: number | undefined;
  readonly column?: number | undefined;
};

export type OutlineSection = {
  readonly id: string;
  readonly depth: number;
  readonly text: string;
};

export type ParsedDocument = {
  readonly document: DocumentNode;
  readonly outline: readonly OutlineSection[];
  readonly plainText: string;
  readonly readingMinutes: number;
  readonly issues: readonly DocumentIssue[];
};

export type ParseOptions = {
  readonly idNamespace?: string | undefined;
};

export const WORDS_PER_MINUTE = 238;

export type DirectiveForm = "leaf" | "container" | "text";

export type ComponentEnvironment = "any" | "server";

export type AttributeSpec =
  | { readonly kind: "string"; readonly required?: boolean; readonly default?: string }
  | { readonly kind: "number"; readonly required?: boolean; readonly default?: number }
  | { readonly kind: "boolean"; readonly default?: boolean }
  | {
      readonly kind: "enum";
      readonly options: readonly string[];
      readonly required?: boolean;
      readonly default?: string;
    };

export type ComponentSpec = {
  readonly directive: string;
  readonly form: DirectiveForm;
  readonly environment: ComponentEnvironment;
  readonly attributes: Readonly<Record<string, AttributeSpec>>;
  readonly example: string;
};
