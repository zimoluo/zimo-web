import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve as resolvePath } from "node:path";

const ROOT = resolvePath(import.meta.dirname, "..");
const SCAN_ROOTS = ["app", "components", "lib"];

const args = new Set(process.argv.slice(2));
const write = args.has("--write");

const COLOR_RENAMES: Readonly<Record<string, string>> = {
  primary: "text",
  saturated: "text-muted",
  pastel: "fill",
  light: "panel",
  "highlight-primary": "edge",
  "highlight-saturated": "edge",
  "highlight-pastel": "edge",
  "highlight-light": "edge",
  highlight: "edge",
  "darklight-primary": "shade",
  "darklight-saturated": "shade",
  "darklight-pastel": "shade",
  "darklight-light": "shade",
};

const COLOR_PREFIXES = [
  "bg",
  "text",
  "border",
  "border-t",
  "border-b",
  "border-l",
  "border-r",
  "border-x",
  "border-y",
  "outline",
  "ring",
  "divide",
  "fill",
  "stroke",
  "from",
  "via",
  "to",
  "shadow",
  "decoration",
  "caret",
  "accent",
  "placeholder",
];

const DIRECT: Readonly<Record<string, string>> = {
  "font-main": "font-sans",
  "font-fancy": "font-display",
  "bg-page": "surface-page",
  "bg-page-minimal": "surface-page-reduced",
  "outline-none": "outline-hidden",
  "overflow-ellipsis": "text-ellipsis",
  "flex-grow": "grow",
  "flex-shrink": "shrink",
  "shadow-sm": "shadow-xs",
  shadow: "shadow-sm",
  "blur-sm": "blur-xs",
  blur: "blur-sm",
  "rounded-sm": "rounded-xs",
  rounded: "rounded-sm",
  "backdrop-blur-sm": "backdrop-blur-xs",
  "backdrop-blur": "backdrop-blur-sm",
  "border-reflect-primary": "surface-edge",
  "border-reflect-saturated": "surface-edge",
  "border-reflect-pastel": "surface-edge",
  "border-reflect-light": "surface-edge",
  "border-reflect": "surface-edge",
  "w-large-screen": "w-[100lvw]",
  "w-small-screen": "w-[100svw]",
  "w-dynamic-screen": "w-[100dvw]",
  "h-large-screen": "h-[100lvh]",
  "h-small-screen": "h-[100svh]",
  "h-dynamic-screen": "h-[100dvh]",
  "max-w-screen": "max-w-[100vw]",
  "border-0.4": "border-[0.4px]",
  "border-0.6": "border-[0.6px]",
  "border-0.8": "border-[0.8px]",
  "border-t-0.8": "border-t-[0.8px]",
  "border-x-0.6": "border-x-[0.6px]",
};

const PREFIXED_DIRECT: readonly (readonly [RegExp, (match: RegExpMatchArray) => string])[] = [
  [/^flex-shrink-(.+)$/, (m) => `shrink-${m[1]}`],
  [/^flex-grow-(.+)$/, (m) => `grow-${m[1]}`],
  [/^bg-widget-(\d+)$/, (m) => `surface-widget surface-widget-${m[1]}`],
  [/^bg-\[--(.+)\]$/, (m) => `bg-(--${m[1]})`],
  [/^text-\[--(.+)\]$/, (m) => `text-(--${m[1]})`],
  [/^border-\[--(.+)\]$/, (m) => `border-(--${m[1]})`],
];

type Token = {
  readonly variants: string;
  readonly base: string;
  readonly modifier: string;
};

const parse = (token: string): Token => {
  const lastColon = token.lastIndexOf(":");
  const variants = lastColon === -1 ? "" : token.slice(0, lastColon + 1);
  const rest = lastColon === -1 ? token : token.slice(lastColon + 1);

  const slash = rest.lastIndexOf("/");
  const bracketed = rest.includes("[") && rest.lastIndexOf("[") > slash;
  const base = slash === -1 || bracketed ? rest : rest.slice(0, slash);
  const modifier = slash === -1 || bracketed ? "" : rest.slice(slash);

  return { variants, base, modifier };
};

const renameColor = (base: string): string | null => {
  for (const prefix of [...COLOR_PREFIXES].sort((a, b) => b.length - a.length)) {
    if (!base.startsWith(`${prefix}-`)) continue;
    const color = base.slice(prefix.length + 1);
    const replacement = COLOR_RENAMES[color];
    if (replacement !== undefined) return `${prefix}-${replacement}`;
  }
  return null;
};

const mapToken = (token: string): string => {
  const { variants, base, modifier } = parse(token);

  const direct = DIRECT[base];
  if (direct !== undefined) {
    return direct
      .split(" ")
      .map((part) => `${variants}${part}${modifier}`)
      .join(" ");
  }

  for (const [pattern, build] of PREFIXED_DIRECT) {
    const match = base.match(pattern);
    if (match !== null) {
      return build(match)
        .split(" ")
        .map((part) => `${variants}${part}${modifier}`)
        .join(" ");
    }
  }

  const renamed = renameColor(base);
  if (renamed !== null) return `${variants}${renamed}${modifier}`;

  return token;
};

const OPACITY = /^(bg|text|border|divide|ring|placeholder)-opacity-(\d+)$/;

function foldOpacity(tokens: readonly string[]): readonly string[] {
  const opacities = new Map<string, string>();
  const rest: string[] = [];

  for (const token of tokens) {
    const { variants, base } = parse(token);
    const match = base.match(OPACITY);
    if (match !== null) {
      opacities.set(`${variants}${match[1]}`, match[2] ?? "100");
      continue;
    }
    rest.push(token);
  }

  if (opacities.size === 0) return tokens;

  return rest.map((token) => {
    const { variants, base, modifier } = parse(token);
    if (modifier !== "") return token;

    for (const [key, value] of opacities) {
      const prefix = key.slice(variants.length);
      if (key.startsWith(variants) && base.startsWith(`${prefix}-`)) {
        return `${variants}${base}/${value}`;
      }
    }
    return token;
  });
}

const OUTLINE_PAIR = /(^|\s)outline\s+outline-1(\s|$)/g;

function rewriteClassList(value: string): string {
  const collapsed = value.replace(OUTLINE_PAIR, "$1outline-1$2");
  const tokens = collapsed.split(/(\s+)/);

  const mapped = tokens.map((piece) =>
    /^\s+$/.test(piece) || piece.length === 0 ? piece : mapToken(piece),
  );

  const folded = foldOpacity(mapped.filter((piece) => !/^\s+$/.test(piece) && piece.length > 0));

  const leading = /^\s*/.exec(collapsed)?.[0] ?? "";
  const trailing = /\s*$/.exec(collapsed)?.[0] ?? "";

  return `${leading}${folded.join(" ")}${trailing}`;
}

const rewriteInterpolation = (segment: string): string =>
  segment.replace(/(["'])((?:[^"'\\]|\\.)*)\1/g, (whole, quote: string, body: string) => {
    if (!/[a-z]-|^[a-z-]+$/.test(body)) return whole;
    const rewritten = rewriteClassList(body);
    return rewritten === body ? whole : `${quote}${rewritten}${quote}`;
  });

const CLASS_ATTRIBUTE = /\b(className|class)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const CLASS_STRING = /\b(classNames?|clsx|cx|twMerge)\(\s*(?:"([^"]*)"|'([^']*)')/g;
const TEMPLATE_CLASS = /className\s*=\s*\{`([\s\S]*?)`\}/g;

function rewriteExpressionContainers(
  source: string,
  rewriteQuoted: (segment: string) => string,
): string {
  const marker = "className={";
  let out = "";
  let cursor = 0;

  for (;;) {
    const start = source.indexOf(marker, cursor);
    if (start === -1) {
      out += source.slice(cursor);
      return out;
    }

    const open = start + marker.length;
    if (source[open] === "`") {
      out += source.slice(cursor, open);
      cursor = open;
      continue;
    }

    let depth = 1;
    let index = open;
    while (index < source.length && depth > 0) {
      const character = source[index];
      if (character === "{") depth += 1;
      else if (character === "}") depth -= 1;
      index += 1;
    }

    const body = source.slice(open, index - 1);
    out += source.slice(cursor, open) + rewriteQuoted(body);
    cursor = index - 1;
  }
}

const collect = (entry: string, out: string[]): void => {
  let info;
  try {
    info = statSync(entry);
  } catch {
    return;
  }
  if (info.isDirectory()) {
    for (const child of readdirSync(entry)) {
      if (child === "node_modules" || child.startsWith(".")) continue;
      collect(join(entry, child), out);
    }
    return;
  }
  if (entry.endsWith(".tsx") || entry.endsWith(".ts")) out.push(entry);
};

const files: string[] = [];
for (const root of SCAN_ROOTS) collect(join(ROOT, root), files);

let changedFiles = 0;
let changedAttributes = 0;
const edits = new Map<string, string>();

for (const file of files) {
  const source = readFileSync(file, "utf8");
  let updated = source;

  updated = updated.replace(CLASS_ATTRIBUTE, (full, attribute: string, dq, sq) => {
    const raw = dq ?? sq;
    if (typeof raw !== "string") return full;

    const rewritten = rewriteClassList(raw);
    if (rewritten === raw) return full;
    changedAttributes += 1;

    return dq !== undefined
      ? `${attribute}="${rewritten}"`
      : `${attribute}='${rewritten}'`;
  });

  updated = updated.replace(TEMPLATE_CLASS, (full, inner: string) => {
    const parts = inner.split(/(\$\{[^}]*\})/);
    const rewritten = parts
      .map((part) =>
        part.startsWith("${") ? rewriteInterpolation(part) : rewriteClassList(part),
      )
      .join("");
    if (rewritten === inner) return full;
    changedAttributes += 1;
    return `className={\`${rewritten}\`}`;
  });

  updated = rewriteExpressionContainers(updated, rewriteInterpolation);

  updated = updated.replace(CLASS_STRING, (full, fn: string, dq, sq) => {
    const raw = dq ?? sq;
    if (typeof raw !== "string") return full;
    const rewritten = rewriteClassList(raw);
    if (rewritten === raw) return full;
    changedAttributes += 1;
    return dq !== undefined ? `${fn}("${rewritten}"` : `${fn}('${rewritten}'`;
  });

  if (updated !== source) {
    edits.set(file, updated);
    changedFiles += 1;
  }
}

console.log("=== codemod-classes ===");
console.log(`files scanned  : ${files.length}`);
console.log(`files changed  : ${changedFiles}`);
console.log(`class lists    : ${changedAttributes}`);
console.log();

const RESIDUAL = [
  /\bbg-light\b/,
  /\bbg-pastel\b/,
  /\bbg-primary\b/,
  /\bbg-saturated\b/,
  /\btext-primary\b/,
  /\btext-saturated\b/,
  /\btext-light\b/,
  /\bborder-saturated\b/,
  /\bbg-widget-\d+\b/,
  /\bbg-page\b/,
  /\bborder-reflect/,
  /-opacity-\d+/,
  /\bhighlight-(primary|saturated|pastel|light)\b/,
  /\bdarklight-/,
  /(?<!-)\bfont-main\b/,
];

const residualCount = (): number => {
  let total = 0;
  for (const file of files) {
    const source = edits.get(file) ?? readFileSync(file, "utf8");
    for (const pattern of RESIDUAL) {
      total += (source.match(new RegExp(pattern.source, "g")) ?? []).length;
    }
  }
  return total;
};

console.log(`residual v10 class references: ${residualCount()}`);

if (!write) {
  console.log("\ndry run; pass --write to apply. Nothing changed.");
  process.exit(0);
}

for (const [file, updated] of edits) writeFileSync(file, updated, "utf8");
console.log(`\nwrote ${edits.size} files`);

const stubborn: string[] = [];
for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const pattern of RESIDUAL) {
    if (pattern.test(source)) {
      stubborn.push(relative(ROOT, file));
      break;
    }
  }
}

if (stubborn.length > 0) {
  console.log(`\n${stubborn.length} file(s) still carry a v10 class reference:`);
  for (const file of stubborn.slice(0, 40)) console.log(`  ${file}`);
}
