import { describe, it, expect, vi } from "vitest";
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FakeObjectStore } from "../storage/fake-objects";
import { migrateContent } from "../../../tools/migrate/harness";
import { restoreBackup, verifyBackup } from "../../../tools/migrate/backup";
import { transformObject } from "../../../tools/migrate/transform";
import { readEntry, readSummaries } from "./read";
import { requireSlug, uuidVersion } from "../../features/entries/model/ids";
import { parseCommentThread } from "../../features/entries/model/schema";

const doc = `---\ntitle: Hello\ndate: "2024-1-2"\nauthor: Zimo Luo\nauthorId: zimo\ndescription: "A *bold* thought"\n---\n# A heading\n\n*bold* and _italic_\n`;
const measure = async (src: string, alt: string) => ({ src, alt, width:1200, height:800 });

describe("content migration and final readers", () => {
  it("dry runs without mutations and commits only after a verified backup/restore", async () => {
    const root = mkdtempSync(join(tmpdir(),"v11-content-"));
    try {
      const store = new FakeObjectStore(); store.seedText("blog/text/hello.md",doc);
      const options = { backupRoot:join(root,"backup"), reportPath:join(root,"report.json"), commit:false };
      const dry = await migrateContent(store,measure,options);
      expect(dry.blocked).toBe(0); expect(store.writes).toEqual([]); expect(store.has("blog/text/hello.md")).toBe(true);
      const applied = await migrateContent(store,measure,{ ...options,commit:true });
      expect(applied.blocked).toBe(0); expect(store.has("blog/text/hello.md")).toBe(false);
      expect(verifyBackup(options.backupRoot).objects).toHaveLength(1);
      const entry = await readEntry(store,"blog",requireSlug("hello"));
      expect(entry?.markdown).toContain("**bold** and *italic*"); expect(entry?.markdown).not.toContain("formatVersion");
      expect(entry?.entry.publishedAt).toBe("2024-01-02T00:00:00.000Z");
      const listed = await readSummaries(store,"blog"); expect(listed[0]?.title).toBe("Hello");
      store.writes.length = 0;
      const again = await migrateContent(store,measure,{ ...options,backupRoot:join(root,"second"),commit:true });
      expect(again.writes).toBe(0); expect(store.writes).toEqual([]);
      await restoreBackup(store,options.backupRoot); expect(store.peek("blog/text/hello.md")).toBe(doc); expect(store.has("blog/documents/hello.md")).toBe(false); expect(store.has("blog/index.json")).toBe(false);
    } finally { rmSync(root,{recursive:true,force:true}); }
  });
  it("resumes after output writes but before renamed-source cleanup and restores the original prefix", async () => {
    const root=mkdtempSync(join(tmpdir(),"v11-resume-"));
    try {
      const store=new FakeObjectStore();store.seedText("blog/text/hello.md",doc);
      const options={commit:true,backupRoot:join(root,"backup"),reportPath:join(root,"report.json")};
      vi.spyOn(store,"remove").mockRejectedValueOnce(new Error("interrupted"));
      await expect(migrateContent(store,measure,options)).rejects.toThrow("interrupted");
      expect(store.has("blog/documents/hello.md")).toBe(true);expect(store.has("blog/text/hello.md")).toBe(true);
      const resumed=await migrateContent(store,measure,{...options,resumePath:options.reportPath});
      expect(resumed.blocked).toBe(0);expect(store.has("blog/text/hello.md")).toBe(false);
      await restoreBackup(store,options.backupRoot);expect(store.peek("blog/text/hello.md")).toBe(doc);expect(store.has("blog/documents/hello.md")).toBe(false);
    } finally {rmSync(root,{recursive:true,force:true});}
  });
  it("blocks an invalid document before any write and reports the failed input", async () => {
    const root = mkdtempSync(join(tmpdir(),"v11-content-"));
    try {
      const store = new FakeObjectStore(); store.seedText("blog/text/hello.md",doc.replace('date: "2024-1-2"','date: nonsense'));
      const result = await migrateContent(store,measure,{commit:true,backupRoot:join(root,"backup"),reportPath:join(root,"report.json")});
      expect(result.blocked).toBe(1); expect(store.writes).toEqual([]); expect(JSON.parse(readFileSync(join(root,"report.json"),"utf8")).rows[0].issues[0].blocking).toBe(true);
    } finally { rmSync(root,{recursive:true,force:true}); }
  });
  it("rejects a corrupted backup before restoring any object", async () => {
    const root = mkdtempSync(join(tmpdir(),"v11-content-"));
    try {
      const store = new FakeObjectStore(); store.seedText("blog/text/hello.md",doc);
      await migrateContent(store,measure,{commit:true,backupRoot:join(root,"backup"),reportPath:join(root,"report.json")});
      writeFileSync(join(root,"backup","objects","blog/text/hello.md"),"tampered");
      const destination = new FakeObjectStore(); await expect(restoreBackup(destination,join(root,"backup"))).rejects.toThrow("integrity"); expect(destination.writes).toEqual([]);
    } finally { rmSync(root,{recursive:true,force:true}); }
  });
  it("migrates comment identities, reply targets and inline text to the final thread schema", async () => {
    const result = await transformObject("photos/comments/hello.json",JSON.stringify([{author:"one",date:"2024-01-02",content:"*hello*",likedBy:[],replies:[{from:"two",date:"2024-01-02",content:"hi"},{from:"three",to:"two",date:"2024-01-02",content:"reply"}]}]),measure);
    expect(await transformObject("photos/comments/hello.json",JSON.stringify([{author:"one",date:"2024-01-02",content:"*hello*",likedBy:[],replies:[{from:"two",date:"2024-01-02",content:"hi"},{from:"three",to:"two",date:"2024-01-02",content:"reply"}]}]),measure)).toEqual(result);
    expect(result.outputs[0]?.key).toBe("album/comments/hello.json");
    const thread = parseCommentThread(JSON.parse(result.outputs[0]?.body ?? "null")); const comment = thread.comments[0];
    expect(uuidVersion(comment?.id ?? "")).toBe(7); expect(comment?.body).toBe("**hello**"); expect(comment?.replies[1]?.toId).toBe(comment?.replies[0]?.id);
  });
  it("records real dimensions for document inline images and supports migration component aliases",async()=>{
    const source=doc+'\n![Authored description](https://example.test/photo.jpg)\n\n&&{ArticleCardFetcher}{"section":"photos","slug":"hello"}&&';
    const result=await transformObject("blog/text/hello.md",source,measure);
    const metadata=JSON.parse(result.outputs.find((output)=>output.key.endsWith(".meta.json"))?.body??"null");
    expect(metadata.images[0]).toMatchObject({width:1200,height:800,alt:"Authored description"});
    expect(result.outputs[0]?.body).toContain('::article-card{section="album" slug="hello"}');expect(result.issues).toEqual([]);
  });
  it("preserves project markdown and measured image identity", async () => {
    const result = await transformObject("projects/entries/hello.json",JSON.stringify({title:"Hello",date:"2024-01-02",authors:["Zimo Luo"],content:["# Project","*bold*"],links:{Source:"https://github.com/x/y"},faviconFormat:"png",images:{url:["https://example.test/a.jpg"],text:["Caption"],aspectRatio:"3:2"}}),measure);
    const store = new FakeObjectStore(); for (const output of result.outputs) store.seedText(output.key,output.body);
    const source = await readEntry(store,"projects",requireSlug("hello")); expect(source?.markdown).toBe("# Project\n**bold**"); expect(source?.entry.images[0]?.width).toBe(1200); expect(source?.entry.extras.section).toBe("projects");
  });
});
