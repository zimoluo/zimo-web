const CHUNK_BOUNDARY = /\n[ \t]*(?=(?:vec[234]|float|int|bool|mat[234]|void|const)\s)/;

const signatureOf = (block: string): string =>
  block.replace(/\s+/g, " ").trim();

export function dedupeChunks(source: string): string {
  const seen = new Set<string>();
  const kept: string[] = [];

  for (const block of source.split(CHUNK_BOUNDARY)) {
    const signature = signatureOf(block);
    if (signature.length === 0) continue;
    if (seen.has(signature)) continue;
    seen.add(signature);
    kept.push(block.replace(/^\n+|\n+$/g, ""));
  }

  return `${kept.join("\n\n")}\n`;
}

export function glsl(strings: TemplateStringsArray, ...parts: readonly string[]): string {
  return dedupeChunks(String.raw({ raw: strings }, ...parts));
}
