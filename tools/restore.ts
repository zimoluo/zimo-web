import { resolve } from "node:path";
import { objects } from "../src/server/storage/object";
import { createLocalObjectStore } from "../src/server/storage/local-store";
import { restoreBackup,verifyBackup } from "./migrate/backup";
const args=process.argv.slice(2),source=args.find((arg)=>!arg.startsWith("--"));
if(source===undefined)throw new Error("usage: content:restore <backup-directory> [--target=local-root] [--confirm]");
const root=resolve(source),manifest=verifyBackup(root),target=args.find((arg)=>arg.startsWith("--target="))?.slice(9);
console.log(JSON.stringify({verified:true,objects:manifest.objects.length,keys:manifest.objects.map((row)=>row.key),dryRun:!args.includes("--confirm")},null,2));
if(args.includes("--confirm"))await restoreBackup(target===undefined?objects():createLocalObjectStore(resolve(target)),root);
