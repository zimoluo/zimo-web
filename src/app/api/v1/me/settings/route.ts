import { z } from "zod";
import { syncSettings } from "@/src/features/account";
import { requireCurrentViewer } from "@/src/server/session/current";
import { requireSameOrigin,readLimitedJson } from "@/src/server/http/same-origin";
import { writeLimiter } from "@/src/server/http/rate-limit";
import { handler,json } from "@/src/server/http/problem";
import { AppError } from "@/src/lib/errors";
export const POST=handler(async(request)=>{
 requireSameOrigin(request);
 const viewer=await requireCurrentViewer();writeLimiter.require(`settings:${viewer.sub}`);
 const parsed=z.object({settings:z.unknown(),domains:z.unknown()}).safeParse(await readLimitedJson(request));
 if(!parsed.success)throw new AppError("invalid-request","The settings upload is invalid.");
 const revision=await syncSettings(parsed.data.settings,parsed.data.domains);
 return json({revision},{headers:{"cache-control":"private, no-store"}});
});
