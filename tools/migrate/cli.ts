import { resolve } from "node:path";
import { usingLocalStorage } from "../../src/server/storage/sender";
import { objects } from "../../src/server/storage/object";
import { createLocalObjectStore } from "../../src/server/storage/local-store";
import { migrateContent,verifyIndexes,MIGRATION_STEPS } from "./harness";
import type { MigrationStep } from "./harness";
import { measureImage } from "./images";

import { pathToFileURL } from "node:url";
export async function runMigrationCli(argv:readonly string[]) {
const raw=argv,values=new Map<string,string>(),flags=new Set<string>(),positions:string[]=[];
const booleanFlags=new Set(["commit","dry-run","verify"]);
for(let index=0;index<raw.length;index+=1) {
 const arg=raw[index]??"";
 if(!arg.startsWith("--")){positions.push(arg);continue;}
 const [name,...rest]=arg.slice(2).split("=");
 if(name===undefined)throw new Error("Missing option name");
 if(booleanFlags.has(name)){if(rest.length>0)throw new Error(`Boolean option ${name} does not take a value`);flags.add(name);continue;}
 if(!["only","limit","backup","report","resume","profile","source"].includes(name))throw new Error(`Unknown option: ${name}`);
 const value=rest.length>0?rest.join("="):raw[++index];
 if(value===undefined||value.startsWith("--"))throw new Error(`Missing value: ${name}`);
 values.set(name,value);
}
const hasStep=(MIGRATION_STEPS as readonly string[]).includes(positions[0]??"");
const step:MigrationStep=hasStep?positions[0] as MigrationStep:"all";
const source=positions[hasStep?1:0]??values.get("source")??(values.get("profile")==="aws"?"aws":undefined);
if(source===undefined)throw new Error("usage: content:migrate [documents|entries|comments|reactions|users|keys|index|all] <directory|aws> [--commit|--verify] [--only=slug] [--limit=n] [--backup=dir] [--report=file] [--resume=file]");
if(flags.has("commit")&&(flags.has("verify")||flags.has("dry-run")))throw new Error("commit cannot be combined with verify or dry-run");
const limit=values.has("limit")?Number(values.get("limit")):undefined;
if(limit!==undefined&&(!Number.isInteger(limit)||limit<=0))throw new Error("limit must be positive");
const stamp=new Date().toISOString().replaceAll(":","-");
if(source === "aws" && usingLocalStorage()) throw new Error("AWS storage is unavailable; configure credentials and disable local-only mode, or select a local directory explicitly.");
const store=source==="aws"?objects():createLocalObjectStore(resolve(source));
const result=await migrateContent(store,measureImage,{step,commit:flags.has("commit"),only:values.get("only"),limit,backupRoot:resolve(values.get("backup")??`work/content-backup/${stamp}`),reportPath:resolve(values.get("report")??`out/content-migration-${stamp}.json`),resumePath:values.get("resume")});
if(flags.has("verify")) {
 if(result.blocked>0||result.rows.some((row)=>!row.completed))throw new Error("Content needs migration; inspect the report.");
 await verifyIndexes(store);
}
return {step,rows:result.rows.length,blocked:result.blocked,writes:result.writes,dryRun:!flags.has("commit"),verified:flags.has("verify")};
}
export function printMigrationResult(result:Awaited<ReturnType<typeof runMigrationCli>>):void { console.log(JSON.stringify(result,null,2));process.exitCode=result.blocked>0?1:0; }
export function handleMigrationFailure(error:unknown):void {console.error(error instanceof Error?error.message:error);process.exitCode=1;}
if(import.meta.url === pathToFileURL(process.argv[1]??"").href) void runMigrationCli(process.argv.slice(2)).then(printMigrationResult).catch(handleMigrationFailure);
