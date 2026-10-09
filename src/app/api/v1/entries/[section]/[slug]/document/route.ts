import { requireEntryParams } from "@/src/server/http/params";
import { handler,notFound } from "@/src/server/http/problem";
import { readEntry } from "@/src/server/entries/read";
import { objects } from "@/src/server/storage/object";
import { CACHE_WEEKS } from "@/src/server/http/context";
type Params={params:Promise<{section:string;slug:string}>};
export const GET=handler<Params>(async(_request,{params})=>{
 const {section,slug}=requireEntryParams(await params),source=await readEntry(objects(),section,slug);
 if(source===null||source.markdown===undefined)throw notFound("This entry has no downloadable document.");
 return new Response(source.markdown,{headers:{"content-type":"text/markdown; charset=utf-8","content-disposition":`attachment; filename="${slug}.md"`,"cache-control":CACHE_WEEKS}});
});
