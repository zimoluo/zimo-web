import { resolve } from "node:path";
import { objects } from "../src/server/storage/object";
import { createLocalObjectStore } from "../src/server/storage/local-store";
import { backupObjects } from "./migrate/backup";
import { CONTENT_PREFIXES } from "./migrate/harness";
const args=process.argv.slice(2),destination=args.find((arg)=>!arg.startsWith("--"));
if(destination===undefined)throw new Error("usage: content:backup <destination> [--source=local-root] [--prefix=prefix] [--dry-run]");
const source=args.find((arg)=>arg.startsWith("--source="))?.slice(9);
const store=source===undefined?objects():createLocalObjectStore(resolve(source));
const prefixes=args.filter((arg)=>arg.startsWith("--prefix=")).map((arg)=>arg.slice(9));
const refs=(await Promise.all((prefixes.length===0?CONTENT_PREFIXES:prefixes).map((prefix)=>store.list(prefix)))).flat();
const keys=[...new Set(refs.map((ref)=>ref.key))].sort();
if(args.includes("--dry-run"))console.log(JSON.stringify({objects:keys.length,keys,dryRun:true},null,2));
else {const at=new Date().toISOString(),root=resolve(destination,at.replaceAll(":","-"));const manifest=await backupObjects(store,keys,root,at);console.log(JSON.stringify({root,objects:manifest.objects.length,verified:true},null,2));}
