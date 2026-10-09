import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

type Rule = { readonly wrong: string; readonly right: string };

const RULES: readonly Rule[] = [
  { wrong: "colour", right: "color" },
  { wrong: "colours", right: "colors" },
  { wrong: "coloured", right: "colored" },
  { wrong: "colouring", right: "coloring" },
  { wrong: "colourful", right: "colorful" },
  { wrong: "behaviour", right: "behavior" },
  { wrong: "behaviours", right: "behaviors" },
  { wrong: "behavioural", right: "behavioral" },
  { wrong: "centre", right: "center" },
  { wrong: "centres", right: "centers" },
  { wrong: "centred", right: "centered" },
  { wrong: "centring", right: "centering" },
  { wrong: "grey", right: "gray" },
  { wrong: "greys", right: "grays" },
  { wrong: "greyish", right: "grayish" },
  { wrong: "greyscale", right: "grayscale" },
  { wrong: "analyse", right: "analyze" },
  { wrong: "analyses", right: "analyzes" },
  { wrong: "analysed", right: "analyzed" },
  { wrong: "analysing", right: "analyzing" },
  { wrong: "catalogue", right: "catalog" },
  { wrong: "catalogues", right: "catalogs" },
  { wrong: "catalogued", right: "cataloged" },
  { wrong: "licence", right: "license" },
  { wrong: "licences", right: "licenses" },
  { wrong: "judgement", right: "judgment" },
  { wrong: "judgements", right: "judgments" },
  { wrong: "neighbour", right: "neighbor" },
  { wrong: "neighbours", right: "neighbors" },
  { wrong: "neighbouring", right: "neighboring" },
  { wrong: "neighbourhood", right: "neighborhood" },
  { wrong: "normalise", right: "normalize" },
  { wrong: "normalised", right: "normalized" },
  { wrong: "normalises", right: "normalizes" },
  { wrong: "normalising", right: "normalizing" },
  { wrong: "normalisation", right: "normalization" },
  { wrong: "serialise", right: "serialize" },
  { wrong: "serialised", right: "serialized" },
  { wrong: "serialising", right: "serializing" },
  { wrong: "serialisation", right: "serialization" },
  { wrong: "deserialise", right: "deserialize" },
  { wrong: "deserialisation", right: "deserialization" },
  { wrong: "optimise", right: "optimize" },
  { wrong: "optimised", right: "optimized" },
  { wrong: "optimises", right: "optimizes" },
  { wrong: "optimising", right: "optimizing" },
  { wrong: "optimisation", right: "optimization" },
  { wrong: "optimisations", right: "optimizations" },
  { wrong: "memoise", right: "memoize" },
  { wrong: "memoised", right: "memoized" },
  { wrong: "memoising", right: "memoizing" },
  { wrong: "organise", right: "organize" },
  { wrong: "organised", right: "organized" },
  { wrong: "organising", right: "organizing" },
  { wrong: "organisation", right: "organization" },
  { wrong: "initialise", right: "initialize" },
  { wrong: "initialised", right: "initialized" },
  { wrong: "initialises", right: "initializes" },
  { wrong: "initialising", right: "initializing" },
  { wrong: "initialisation", right: "initialization" },
  { wrong: "capitalise", right: "capitalize" },
  { wrong: "capitalised", right: "capitalized" },
  { wrong: "capitalisation", right: "capitalization" },
  { wrong: "systematise", right: "systematize" },
  { wrong: "systematises", right: "systematizes" },
  { wrong: "systematised", right: "systematized" },
  { wrong: "prioritise", right: "prioritize" },
  { wrong: "prioritised", right: "prioritized" },
  { wrong: "prioritising", right: "prioritizing" },
  { wrong: "visualise", right: "visualize" },
  { wrong: "visualised", right: "visualized" },
  { wrong: "visualising", right: "visualizing" },
  { wrong: "visualisation", right: "visualization" },
  { wrong: "customise", right: "customize" },
  { wrong: "customised", right: "customized" },
  { wrong: "customising", right: "customizing" },
  { wrong: "customisation", right: "customization" },
  { wrong: "synchronise", right: "synchronize" },
  { wrong: "synchronised", right: "synchronized" },
  { wrong: "synchronising", right: "synchronizing" },
  { wrong: "synchronisation", right: "synchronization" },
  { wrong: "minimise", right: "minimize" },
  { wrong: "minimised", right: "minimized" },
  { wrong: "minimising", right: "minimizing" },
  { wrong: "maximise", right: "maximize" },
  { wrong: "maximised", right: "maximized" },
  { wrong: "maximising", right: "maximizing" },
  { wrong: "summarise", right: "summarize" },
  { wrong: "summarised", right: "summarized" },
  { wrong: "standardise", right: "standardize" },
  { wrong: "standardised", right: "standardized" },
  { wrong: "standardisation", right: "standardization" },
  { wrong: "emphasise", right: "emphasize" },
  { wrong: "emphasised", right: "emphasized" },
  { wrong: "emphasises", right: "emphasizes" },
  { wrong: "recognise", right: "recognize" },
  { wrong: "recognised", right: "recognized" },
  { wrong: "recognises", right: "recognizes" },
  { wrong: "realise", right: "realize" },
  { wrong: "realised", right: "realized" },
  { wrong: "specialise", right: "specialize" },
  { wrong: "specialised", right: "specialized" },
  { wrong: "specialisation", right: "specialization" },
  { wrong: "generalise", right: "generalize" },
  { wrong: "generalised", right: "generalized" },
  { wrong: "generalisation", right: "generalization" },
  { wrong: "utilise", right: "utilize" },
  { wrong: "utilised", right: "utilized" },
  { wrong: "utilisation", right: "utilization" },
  { wrong: "authorise", right: "authorize" },
  { wrong: "authorised", right: "authorized" },
  { wrong: "authorisation", right: "authorization" },
  { wrong: "categorise", right: "categorize" },
  { wrong: "categorised", right: "categorized" },
  { wrong: "categorisation", right: "categorization" },
  { wrong: "characterise", right: "characterize" },
  { wrong: "characterised", right: "characterized" },
  { wrong: "parameterise", right: "parameterize" },
  { wrong: "parameterised", right: "parameterized" },
  { wrong: "parameterisation", right: "parameterization" },
  { wrong: "tokenise", right: "tokenize" },
  { wrong: "tokenised", right: "tokenized" },
  { wrong: "randomise", right: "randomize" },
  { wrong: "randomised", right: "randomized" },
  { wrong: "sanitise", right: "sanitize" },
  { wrong: "sanitised", right: "sanitized" },
  { wrong: "sanitisation", right: "sanitization" },
  { wrong: "localise", right: "localize" },
  { wrong: "localised", right: "localized" },
  { wrong: "localisation", right: "localization" },
  { wrong: "finalise", right: "finalize" },
  { wrong: "finalised", right: "finalized" },
  { wrong: "formalise", right: "formalize" },
  { wrong: "quantise", right: "quantize" },
  { wrong: "quantised", right: "quantized" },
  { wrong: "rasterise", right: "rasterize" },
  { wrong: "rasterised", right: "rasterized" },
  { wrong: "harmonise", right: "harmonize" },
  { wrong: "apologise", right: "apologize" },
  { wrong: "cancelled", right: "canceled" },
  { wrong: "cancelling", right: "canceling" },
  { wrong: "labelled", right: "labeled" },
  { wrong: "labelling", right: "labeling" },
  { wrong: "modelled", right: "modeled" },
  { wrong: "modelling", right: "modeling" },
  { wrong: "travelled", right: "traveled" },
  { wrong: "travelling", right: "traveling" },
  { wrong: "signalled", right: "signaled" },
  { wrong: "marvellous", right: "marvelous" },
  { wrong: "skilful", right: "skillful" },
  { wrong: "wilful", right: "willful" },
  { wrong: "enrolment", right: "enrollment" },
  { wrong: "fulfilment", right: "fulfillment" },
  { wrong: "instalment", right: "installment" },
  { wrong: "defence", right: "defense" },
  { wrong: "offence", right: "offense" },
  { wrong: "pretence", right: "pretense" },
  { wrong: "programme", right: "program" },
  { wrong: "programmes", right: "programs" },
  { wrong: "metre", right: "meter" },
  { wrong: "metres", right: "meters" },
  { wrong: "litre", right: "liter" },
  { wrong: "litres", right: "liters" },
  { wrong: "fibre", right: "fiber" },
  { wrong: "fibres", right: "fibers" },
  { wrong: "calibre", right: "caliber" },
  { wrong: "theatre", right: "theater" },
  { wrong: "spectre", right: "specter" },
  { wrong: "manoeuvre", right: "maneuver" },
  { wrong: "mould", right: "mold" },
  { wrong: "moulds", right: "molds" },
  { wrong: "sceptical", right: "skeptical" },
  { wrong: "sceptic", right: "skeptic" },
  { wrong: "storey", right: "story" },
  { wrong: "storeys", right: "stories" },
  { wrong: "tyre", right: "tire" },
  { wrong: "tyres", right: "tires" },
  { wrong: "whilst", right: "while" },
  { wrong: "amongst", right: "among" },
];

const SCAN_ROOTS = [
  ".github",
  "src",
  "tools",
  "components",
  "lib",
  "interfaces",
  "styles",
  "docs",
  "test",
];

const SCAN_FILES = ["README.md", "next.config.ts", "postcss.config.js"];

const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".css",
  ".scss",
  ".md",
  ".json",
  ".html",
  ".glsl",
  ".yml",
  ".yaml",
]);

const EXCLUDED_DIRECTORIES = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
]);

const SELF = "tools/lint-spelling.ts";

const IGNORE_MARKER = "spelling-ignore";

type Finding = {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly found: string;
  readonly suggestion: string;
};

const PATTERN = new RegExp(`\\b(${RULES.map((rule) => rule.wrong).join("|")})\\b`, "gi");

const SUGGESTIONS = new Map(RULES.map((rule) => [rule.wrong, rule.right]));

const matchCase = (found: string, suggestion: string): string => {
  if (found === found.toUpperCase()) return suggestion.toUpperCase();
  const first = found.charAt(0);
  if (first === first.toUpperCase()) {
    return suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
  }
  return suggestion;
};

function collectFiles(entry: string, out: string[]): void {
  let info;
  try {
    info = statSync(entry);
  } catch {
    return;
  }
  if (info.isDirectory()) {
    for (const child of readdirSync(entry)) {
      if (EXCLUDED_DIRECTORIES.has(child)) continue;
      if (child.startsWith(".") && child !== ".github") continue;
      collectFiles(join(entry, child), out);
    }
    return;
  }
  if (SCAN_EXTENSIONS.has(extname(entry))) out.push(entry);
}

function scan(file: string): readonly Finding[] {
  const relativePath = relative(process.cwd(), file);
  if (relativePath === SELF) return [];

  const findings: Finding[] = [];
  const lines = readFileSync(file, "utf8").split("\n");

  lines.forEach((text, index) => {
    if (text.includes(IGNORE_MARKER)) return;
    PATTERN.lastIndex = 0;
    let match = PATTERN.exec(text);
    while (match !== null) {
      const found = match[0];
      const suggestion = SUGGESTIONS.get(found.toLowerCase());
      if (suggestion !== undefined) {
        findings.push({
          file: relativePath,
          line: index + 1,
          column: match.index + 1,
          found,
          suggestion: matchCase(found, suggestion),
        });
      }
      match = PATTERN.exec(text);
    }
  });

  return findings;
}

const files: string[] = [];
for (const root of SCAN_ROOTS) collectFiles(join(process.cwd(), root), files);
for (const file of SCAN_FILES) collectFiles(join(process.cwd(), file), files);

const findings = files.flatMap(scan);

if (findings.length === 0) {
  console.log(`lint-spelling: ${files.length} files scanned, no British spellings found.`);
  process.exit(0);
}

const byFile = new Map<string, Finding[]>();
for (const finding of findings) {
  const bucket = byFile.get(finding.file);
  if (bucket === undefined) byFile.set(finding.file, [finding]);
  else bucket.push(finding);
}

for (const [file, bucket] of [...byFile].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`\n${file}`);
  for (const finding of bucket) {
    console.log(
      `  ${finding.line}:${finding.column}  ${finding.found} -> ${finding.suggestion}`,
    );
  }
}

console.log(
  `\nlint-spelling: ${findings.length} occurrence(s) in ${byFile.size} file(s) of ${files.length} scanned.`,
);
process.exit(1);
