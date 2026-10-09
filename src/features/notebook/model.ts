import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import { parseMarks } from "../document/marks";
import type { MarkNode } from "../document/marks";

export const SPAN_STYLES = ["bold", "italic", "code", "mark", "strike", "link"] as const;
export type SpanStyle = (typeof SPAN_STYLES)[number];
export type Span = { readonly from: number; readonly to: number; readonly style: SpanStyle; readonly href?: string | undefined };
export type NotebookPage = { readonly id: string; readonly text: string; readonly spans: readonly Span[]; readonly createdAt: string; readonly updatedAt: string };
export const spanSchema = z.object({ from:z.number().int().nonnegative(),to:z.number().int().nonnegative(),style:z.enum(SPAN_STYLES),href:z.string().optional() });
export const notebookPageSchema = z.object({ id:z.uuid({version:"v7"}),text:z.string(),spans:z.array(spanSchema),createdAt:z.iso.datetime(),updatedAt:z.iso.datetime() });
const safeHref = (href: string | undefined): href is string => href !== undefined && /^(?:https?:\/\/|mailto:|\/|#)/i.test(href) && !/[\u0000-\u0020]/.test(href);

export function normalizeSpans(spans: readonly Span[], text: string | number): readonly Span[] {
  const length = typeof text === "string" ? text.length : Math.max(0,Math.trunc(text));
  const boundaries = typeof text === "string" ? [0,...Array.from(new Intl.Segmenter("und",{granularity:"grapheme"}).segment(text),({index,segment}) => index+segment.length)] : [];
  const floor = (offset: number): number => boundaries.length === 0 ? offset : boundaries.filter((point) => point <= offset).at(-1) ?? 0;
  const ceil = (offset: number): number => boundaries.length === 0 ? offset : boundaries.find((point) => point >= offset) ?? length;
  const groups = new Map<SpanStyle,Span[]>();
  for (const span of spans) {
    if (!Number.isFinite(span.from) || !Number.isFinite(span.to) || span.from < 0 || span.from >= length || span.from >= span.to || !(SPAN_STYLES as readonly string[]).includes(span.style)) continue;
    if (span.style === "link" && !safeHref(span.href)) continue;
    const value = { ...span,from:floor(Math.trunc(span.from)),to:ceil(Math.min(length,Math.trunc(span.to))) };
    groups.set(span.style,[...(groups.get(span.style) ?? []),value]);
  }
  const result: Span[] = [];
  for (const [style,group] of groups) {
    group.sort((a,b) => a.from-b.from || a.to-b.to || (a.href ?? "").localeCompare(b.href ?? ""));
    const merged: Span[] = [];
    for (const span of group) {
      const last = merged.at(-1);
      if (last === undefined || last.to < span.from) { merged.push(span); continue; }
      if (style !== "link" || last.href === span.href) { merged[merged.length-1] = { ...last,to:Math.max(last.to,span.to) }; continue; }
      if (last.from < span.from) merged[merged.length-1] = { ...last,to:span.from }; else merged.pop();
      merged.push(span);
    }
    result.push(...merged);
  }
  return result.sort((a,b) => a.from-b.from || a.style.localeCompare(b.style));
}

export const newPage = (text = "", at = new Date().toISOString()): NotebookPage => ({ id:uuidv7({msecs:Date.parse(at)}),text,spans:[],createdAt:at,updatedAt:at });

export function markdownToSpans(markdown: string): { readonly text: string; readonly spans: readonly Span[] } {
  let text = ""; const spans: Span[] = [];
  const visit = (node: MarkNode): void => {
    const from = text.length;
    if (node.kind === "text" || node.kind === "code") text += node.value;
    else node.children.forEach(visit);
    const style = node.kind === "strong" ? "bold" : node.kind === "emphasis" ? "italic" : node.kind;
    if (style !== "text") spans.push({from,to:text.length,style,...(node.kind === "link" ? {href:node.href} : {})});
  };
  parseMarks(markdown, { preserveBlocks: true }).forEach(visit);
  return {text,spans:normalizeSpans(spans,text)};
}

const escapeText = (text: string): string => text.replace(/[\\`*_\[\]~|=]/g,"\\$&");
const marker = (span: Span, closing: boolean, text:string): string => {
  switch (span.style) { case "bold":return "**"; case "italic":return "*"; case "code": { const value=text.slice(span.from,span.to); const runs=value.match(/`+/g)??[]; const fence="`".repeat(Math.max(0,...runs.map((run)=>run.length))+1); const pad=value.startsWith("`")||value.endsWith("`")||(/^ .+ $/.test(value)&&value.trim().length>0)?" ":""; return closing?`${pad}${fence}`:`${fence}${pad}`; } case "mark":return "=="; case "strike":return "~~"; case "link":return closing ? `](${span.href ?? ""})` : "["; }
};
export function spansToMarkdown(page: Pick<NotebookPage,"text"|"spans">): string {
  const spans = normalizeSpans(page.spans,page.text);
  const points = [...new Set([0,page.text.length,...spans.flatMap((span) => [span.from,span.to])])].sort((a,b) => a-b);
  let result = ""; let open: readonly Span[] = [];
  for (let index=0;index<points.length-1;index+=1) {
    const from=points[index] ?? 0,to=points[index+1] ?? from;
    const active = spans.filter((span) => span.from <= from && span.to >= to).sort((a,b) => a.from-b.from || b.to-a.to || SPAN_STYLES.indexOf(a.style)-SPAN_STYLES.indexOf(b.style));
    let shared=0; while(shared<open.length && shared<active.length && open[shared] === active[shared]) shared+=1;
    for (const span of open.slice(shared).reverse()) result+=marker(span,true,page.text);
    for (const span of active.slice(shared)) result+=marker(span,false,page.text);
    const value=page.text.slice(from,to); result+=active.some((span) => span.style === "code") ? value : escapeText(value);
    open=active;
  }
  for (const span of [...open].reverse()) result+=marker(span,true,page.text);
  return result;
}

export function shiftSpans(spans: readonly Span[], before: string, after: string): readonly Span[] {
  let start=0; while(start<before.length && start<after.length && before[start]===after[start]) start+=1;
  let oldEnd=before.length,newEnd=after.length; while(oldEnd>start && newEnd>start && before[oldEnd-1]===after[newEnd-1]) { oldEnd-=1;newEnd-=1; }
  const delta=newEnd-oldEnd;
  return normalizeSpans(spans.map((span) => ({...span,from:span.from<=start ? span.from : span.from>=oldEnd ? span.from+delta : start,to:span.to<=start ? span.to : span.to>=oldEnd ? span.to+delta : newEnd})),after);
}
