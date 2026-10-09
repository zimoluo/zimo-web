import { readLimitedBody } from "./body";
import { AppError } from "../../lib/errors";
export function requireSameOrigin(request:Request):void {
 const origin=request.headers.get("origin");
 if(origin !== new URL(request.url).origin || ["cross-site","same-site"].includes(request.headers.get("sec-fetch-site")??"")) throw new AppError("forbidden","This request must come from this site.");
 if(request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") throw new AppError("invalid-request","Send application/json.");
}
export async function readLimitedJson(request:Request,limit=1024*1024):Promise<unknown> {
 const buffer = await readLimitedBody(request,limit,"The settings upload is too large.");
 try{return JSON.parse(new TextDecoder().decode(buffer)) as unknown;}catch{throw new AppError("invalid-request","Send valid JSON.");}
}
