export function structuralPaintRanges(svg: string): readonly (readonly [number, number])[] {
  const ranges: [number, number][] = [], stack: { name: string; start: number }[] = [];
  const tags = /<(\/?)(mask|clipPath)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g;
  for (const match of svg.matchAll(tags)) {
    const start = match.index, end = start + match[0].length;
    if (match[1] === "/") {
      const opening = stack.pop();
      if (!opening || opening.name !== match[2]) throw new Error("Unbalanced SVG structural paint container");
      ranges.push([opening.start, end]);
    } else if (match[0].endsWith("/>")) ranges.push([start, end]);
    else stack.push({ name: match[2]!, start });
  }
  if (stack.length > 0) throw new Error("Unclosed SVG structural paint container");
  return ranges;
}
