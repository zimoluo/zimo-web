import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { z } from "zod";
import type { ObjectStore } from "../../src/server/storage/object";
import { parseStoredEntry } from "../../src/features/entries/model/schema";
import { buildIndex, diffIndex, clean } from "../../src/features/entries/index-build";
import { SECTIONS } from "../../src/features/entries/model/types";
import { keys, slugFromKey } from "../../src/server/storage/keys";
import { parseSectionIndex } from "../../src/features/entries/model/schema";
import { createLocalObjectStore } from "../../src/server/storage/local-store";
import { backupObjects, digest, restoreBackup, verifyBackup } from "./backup";
import { transformObject } from "./transform";
import type { MeasureImage } from "./transform";

export const CONTENT_PREFIXES = ["blog/text/","blog/documents/","blog/comments/","blog/likedBy/","blog/reactions/","photos/entries/","photos/comments/","photos/likedBy/","album/entries/","album/comments/","album/reactions/","projects/entries/","projects/comments/","projects/likedBy/","projects/reactions/","about/text/","about/comments/","about/homepage/","about/aboutpage/","management/documents/","management/comments/","management/reactions/","account/users/","home/","special/christmas/tree.json"] as const;
const resumeSchema = z.object({ rows: z.array(z.object({ key: z.string(), completed: z.boolean(), before: z.string().nullable(), after: z.string().nullable(), issues: z.array(z.object({ message: z.string(), blocking: z.boolean() })) })) });
export type MigrationRow = z.infer<typeof resumeSchema>["rows"][number];
export type MigrationOptions = { readonly commit: boolean; readonly backupRoot: string; readonly reportPath: string; readonly only?: string | undefined; readonly limit?: number | undefined; readonly resumePath?: string | undefined; readonly step?: MigrationStep | undefined };

export const MIGRATION_STEPS=["documents","entries","comments","reactions","users","keys","index","all"] as const;
export type MigrationStep=(typeof MIGRATION_STEPS)[number];
const matchesStep=(key:string,step:MigrationStep):boolean=>step === "all" || step === "keys" || step === "index" ? true : step === "documents" ? /^(blog\/(text|documents)|about\/text|management\/documents)\//.test(key) : step === "entries" ? /^(photos|album|projects)\/entries\//.test(key) : step === "comments" ? key.includes("/comments/") || key.endsWith("/messages.json") : step === "reactions" ? /\/(likedBy|reactions)\//.test(key) : key.startsWith("account/users/");
export async function verifyIndexes(store:ObjectStore):Promise<void> {
  for(const section of SECTIONS) {
    const entries=[];
    for(const ref of await store.list(keys.entryPrefix(section))) {
      if(slugFromKey(section,ref.key) === null) continue;
      const key=ref.key.endsWith(".md") ? ref.key.replace(/\.md$/,".meta.json") : ref.key;
      const entry=await store.readJson(key,parseStoredEntry);
      if(entry === null) throw new Error(`Missing metadata: ${key}`);
      entries.push(entry.value);
    }
    const index=await store.readJson(keys.sectionIndex(section),parseSectionIndex);
    if(index === null || !clean(diffIndex(index.value,entries))) throw new Error(`Index drift: ${section}`);
  }
}

export async function migrateContent(store: ObjectStore, measure: MeasureImage, options: MigrationOptions): Promise<{ readonly rows: readonly MigrationRow[]; readonly blocked: number; readonly writes: number }> {
  const checkpoint = options.resumePath === undefined ? [] : resumeSchema.parse(JSON.parse(readFileSync(options.resumePath,"utf8"))).rows;
  const completed = new Map(checkpoint.filter((row) => row.completed).map((row) => [row.key,row]));
  const refs = (await Promise.all(CONTENT_PREFIXES.map((prefix) => store.list(prefix)))).flat();
  const sourceKeys = (options.step === "index" ? [] : [...new Set(refs.map((ref) => ref.key))]).filter((key) => !key.endsWith("/index.json") && matchesStep(key,options.step ?? "all") && (options.only === undefined || key.includes(options.only))).sort().slice(0,options.limit);
  const originals = new Map<string,{ body: string; etag: string }>();
  const outputs = new Map<string,{ body: string; source: string }>();
  const rows: MigrationRow[] = [];
  for (const key of sourceKeys) {
    const prior = completed.get(key);
    if (prior !== undefined) { const current = await store.readText(key); if (prior.after === null || (current !== null && digest(current.value) === prior.after)) { rows.push(prior); continue; } }
    const record = await store.readText(key); if (record === null) continue;
    originals.set(key,{ body:record.value,etag:record.etag });
    try {
      const result = await transformObject(key,record.value,measure);
      const issues = result.issues.map(({ message,blocking }) => ({message,blocking}));
      let changed = false;
      for (const output of result.outputs) {
        const current = await store.readText(output.key);
        if (current !== null && current.value === output.body) { outputs.set(output.key,{body:output.body,source:key}); continue; }
        if (current !== null && output.key !== key && !output.key.endsWith(".meta.json")) {
          issues.push({ message:`Target already exists with different content: ${output.key}`,blocking:true }); continue;
        }
        if (outputs.has(output.key) && outputs.get(output.key)?.body !== output.body) issues.push({message:`Two inputs map to ${output.key}`,blocking:true});
        outputs.set(output.key,{body:output.body,source:key}); changed = true;
      }
      rows.push({ key, completed:!changed && !result.outputs.some((output) => output.key !== key), before:digest(record.value), after:changed ? null : digest(record.value), issues });
    } catch (error) { rows.push({ key,completed:false,before:digest(record.value),after:null,issues:[{message:error instanceof Error ? error.message : "Transformation failed",blocking:true}] }); }
  }
  const blocked = rows.filter((row) => row.issues.some((issue) => issue.blocking)).length;
  let writes = 0;
  const save = () => { mkdirSync(dirname(options.reportPath),{recursive:true}); writeFileSync(options.reportPath,`${JSON.stringify({ version:1,commit:options.commit,blocked,writes,rows,outputs:[...outputs].map(([key,value]) => ({key,source:value.source,after:digest(value.body),body:value.body})) },null,2)}\n`); };
  save();
  if (!options.commit || blocked > 0) return {rows,blocked,writes};
  const backupKeys = [...new Set([...sourceKeys,...outputs.keys(),...SECTIONS.map(keys.sectionIndex)])];
  const manifest = options.resumePath !== undefined && existsSync(`${options.backupRoot}/manifest.json`) ? verifyBackup(options.backupRoot) : await backupObjects(store,backupKeys,options.backupRoot);
  const restored = createLocalObjectStore(`${options.backupRoot}/restore-check`);
  await restoreBackup(restored,options.backupRoot);
  if ((await restored.list("")).length !== manifest.objects.length) throw new Error("Backup restore count differs");
  for (const [key,output] of outputs) {
    const current = await store.readText(key);
    if (current !== null && current.value === output.body) continue;
    const original = originals.get(key);
    if (original !== undefined && current?.etag !== original.etag) throw new Error(`Content changed during migration: ${key}`);
    await store.writeText(key,output.body,current === null ? { ifAbsent:true,contentType:key.endsWith(".md") ? "text/markdown" : "application/json" } : { ifMatch:current.etag,contentType:key.endsWith(".md") ? "text/markdown" : "application/json" });
    const verified = await store.readText(key);
    if (verified === null || digest(verified.value) !== digest(output.body)) throw new Error(`Write verification failed: ${key}`);
    writes += 1; save();
  }
  for (const row of rows) {
    const mapped = [...outputs.entries()].filter(([,output]) => output.source === row.key);
    if (mapped.length === 0) continue;
    if (!mapped.some(([key]) => key === row.key)) {
      const current=await store.readText(row.key);
      if(current !== null && current.etag !== originals.get(row.key)?.etag) throw new Error(`Source changed before cleanup: ${row.key}`);
      await store.remove(row.key);
    }
    row.completed = true;
    row.after = mapped.find(([key]) => key === row.key)?.[1] === undefined ? null : digest(mapped.find(([key]) => key === row.key)?.[1].body ?? "");
    save();
  }
  for (const section of SECTIONS) {
    const refs = await store.list(keys.entryPrefix(section));
    const entries = [];
    for (const ref of refs) {
      const slug = slugFromKey(section,ref.key); if (slug === null) continue;
      const metadataKey = ref.key.endsWith(".md") ? ref.key.replace(/\.md$/,".meta.json") : ref.key;
      const entry = await store.readJson(metadataKey,parseStoredEntry);
      if (entry === null) throw new Error(`Missing metadata: ${metadataKey}`);
      entries.push(entry.value);
    }
    const existing = await store.readJson(keys.sectionIndex(section),parseSectionIndex);
    if (existing !== null && clean(diffIndex(existing.value,entries))) continue;
    await store.writeJson(keys.sectionIndex(section),buildIndex(section,entries,new Date().toISOString())); writes += 1;
  }
  save(); return {rows,blocked,writes};
}
