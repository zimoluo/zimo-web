import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { z } from "zod";
import type { ObjectStore } from "../../src/server/storage/object";

const rowSchema = z.object({ key: z.string().min(1), sha256: z.string().regex(/^[a-f0-9]{64}$/), bytes: z.number().int().nonnegative(), etag: z.string() });
const manifestSchema = z.object({ version: z.literal(1), at: z.string(), objects: z.array(rowSchema), absentKeys: z.array(z.string().min(1)).default([]) });
export type BackupManifest = z.infer<typeof manifestSchema>;
export const digest = (body: string): string => createHash("sha256").update(body).digest("hex");
export const safeFile = (root: string, key: string): string => {
  const base = resolve(root), path = resolve(base,key);
  if (!path.startsWith(`${base}/`)) throw new Error(`Backup key escapes its root: ${key}`);
  return path;
};
export async function backupObjects(store: ObjectStore, keys: readonly string[], root: string, at = new Date().toISOString()): Promise<BackupManifest> {
  const rows: BackupManifest["objects"] = [];
  const absentKeys: string[] = [];
  for (const key of [...new Set(keys)].sort()) {
    const record = await store.readText(key);
    if (record === null) { absentKeys.push(key); continue; }
    const path = safeFile(root, `objects/${key}`);
    mkdirSync(dirname(path),{recursive:true}); writeFileSync(path,record.value,"utf8");
    rows.push({ key, sha256: digest(record.value), bytes: Buffer.byteLength(record.value), etag: record.etag });
  }
  const manifest: BackupManifest = { version: 1, at, objects: rows, absentKeys };
  mkdirSync(root,{recursive:true}); writeFileSync(join(root,"manifest.json"),`${JSON.stringify(manifest,null,2)}\n`);
  verifyBackup(root);
  return manifest;
}
export function verifyBackup(root: string): BackupManifest {
  const manifest = manifestSchema.parse(JSON.parse(readFileSync(join(root,"manifest.json"),"utf8")));
  for (const row of manifest.objects) {
    const body = readFileSync(safeFile(root,`objects/${row.key}`),"utf8");
    if (digest(body) !== row.sha256 || Buffer.byteLength(body) !== row.bytes) throw new Error(`Backup integrity failed: ${row.key}`);
  }
  return manifest;
}
export async function restoreBackup(store: ObjectStore, root: string): Promise<void> {
  const manifest = verifyBackup(root);
  for (const key of manifest.absentKeys) await store.remove(key);
  for (const row of manifest.objects) {
    const body = readFileSync(safeFile(root,`objects/${row.key}`),"utf8");
    await store.writeText(row.key,body,{contentType:row.key.endsWith(".md") ? "text/markdown" : "application/json"});
    const restored = await store.readText(row.key);
    if (restored === null || digest(restored.value) !== row.sha256) throw new Error(`Restored content differs: ${row.key}`);
  }
}
