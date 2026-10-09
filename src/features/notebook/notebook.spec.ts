import { describe,it,expect } from "vitest";
import fc from "fast-check";
import { normalizeSpans,spansToMarkdown,markdownToSpans,shiftSpans } from "./model";
import type { Span } from "./model";
import { migrateWorkspace } from "../workspace/migrate";
import { workspaceStore } from "../workspace/store";
import { defaultWorkspace } from "../workspace/model";

describe("notebook ranges",()=>{
 it("uses exclusive end offsets for whole, last and single-character spans",()=>{
  expect(spansToMarkdown({text:"abc",spans:[{from:0,to:3,style:"bold"}]})).toBe("**abc**");
  expect(spansToMarkdown({text:"abc",spans:[{from:2,to:3,style:"bold"}]})).toBe("ab**c**");
  expect(spansToMarkdown({text:"x",spans:[{from:0,to:1,style:"bold"}]})).toBe("**x**");
 });
 it("merges like styles and truncates conflicting link destinations",()=>{
  expect(normalizeSpans([{from:0,to:3,style:"bold"},{from:2,to:5,style:"bold"}],"abcde")).toEqual([{from:0,to:5,style:"bold"}]);
  expect(normalizeSpans([{from:0,to:4,style:"link",href:"/a"},{from:2,to:5,style:"link",href:"/b"}],"abcde")).toEqual([{from:0,to:2,style:"link",href:"/a"},{from:2,to:5,style:"link",href:"/b"}]);
 });
 it("snaps emoji and combining sequences outward",()=>{
  expect(normalizeSpans([{from:1,to:2,style:"bold"}],"😀x")).toEqual([{from:0,to:2,style:"bold"}]);
  expect(normalizeSpans([{from:0,to:1,style:"bold"}],"e\u0301x")).toEqual([{from:0,to:2,style:"bold"}]);
 });
 it("is total and idempotent over arbitrary ranges and Unicode buffers",()=>{
  const span=fc.record({from:fc.integer({min:-10,max:100}),to:fc.integer({min:-10,max:100}),style:fc.constantFrom("bold","italic","link") as fc.Arbitrary<Span["style"]>,href:fc.constant("/link")});
  fc.assert(fc.property(fc.string(),fc.array(span),(text,spans)=>{const normalized=normalizeSpans(spans,text);expect(normalizeSpans(normalized,text)).toEqual(normalized);for(const range of normalized){expect(range.from).toBeGreaterThanOrEqual(0);expect(range.to).toBeLessThanOrEqual(text.length);expect(range.to).toBeGreaterThan(range.from);}}));
 });
 it.each(["**bold**", "*italic*", "`code`", "==marked==", "~~struck~~", "[linked](https://example.test)", "**bold *nested***"])("round-trips supported Markdown %s",(source)=>{
  const parsed=markdownToSpans(source);const emitted=spansToMarkdown(parsed);expect(markdownToSpans(emitted)).toEqual(parsed);
 });
 it("exports literal code backticks without losing their contents",()=>{const page={text:"x`y",spans:[{from:0,to:3,style:"code" as const}]};expect(spansToMarkdown(page)).toBe("``x`y``");expect(markdownToSpans(spansToMarkdown(page))).toEqual(page);});
 it("preserves blank lines and trailing line breaks when importing",()=>{
  const source="**first**\n\nsecond\n"; const parsed=markdownToSpans(source);expect(parsed.text).toBe("first\n\nsecond\n"); expect(spansToMarkdown(parsed)).toBe(source);
 });
 it("shifts styles on insertion/deletion while preserving the final character",()=>{
  expect(shiftSpans([{from:2,to:3,style:"bold"}],"abc","aXbc")).toEqual([{from:3,to:4,style:"bold"}]);
  expect(shiftSpans([{from:1,to:3,style:"bold"}],"abc","ac")).toEqual([{from:1,to:2,style:"bold"}]);
 });
 it("migrates inclusive legacy spans and email addresses",()=>{
  const next=migrateWorkspace({notebookData:[{content:"abc",date:"2024-01-01",lastEditedDate:"2024-01-02",contentStyles:[{fromIndex:2,toIndex:2,style:"bold"},{fromIndex:0,toIndex:1,style:"email",additionalData:"a@example.test"}]}],notebookIndex:0});
  expect(next.notebook.pages[0]?.spans).toEqual([{from:0,to:2,style:"link",href:"mailto:a@example.test"},{from:2,to:3,style:"bold"}]);
 });
 it("keeps active identity when an earlier page is removed",()=>{
  workspaceStore.getState().restoreWorkspace(defaultWorkspace);
  const first=workspaceStore.getState().addPage("first"),second=workspaceStore.getState().addPage("second"),third=workspaceStore.getState().addPage("third");
  workspaceStore.getState().selectPage(second);workspaceStore.getState().removePage(first);expect(workspaceStore.getState().notebook.activeId).toBe(second);
  workspaceStore.getState().removePage(second);expect(workspaceStore.getState().notebook.activeId).toBe(third);
 });
});
