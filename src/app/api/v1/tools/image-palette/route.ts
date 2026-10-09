import { imagePalette,readImageUpload } from "@/src/server/tools/image-palette";
import { handler,json } from "@/src/server/http/problem";
import { clientIp,writeLimiter } from "@/src/server/http/rate-limit";
export const POST=handler(async(request)=>{
 writeLimiter.require(`palette:${clientIp(request)}`);
 return json(await imagePalette(await readImageUpload(request)),{headers:{"cache-control":"no-store"}});
});
