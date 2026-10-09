import "server-only";
import sharp from "sharp";
import { Vibrant } from "node-vibrant/node";
import { readLimitedBody } from "../http/body";
import { AppError } from "../../lib/errors";
import { gammaToLinear,linearSrgbToOklch } from "../../features/theme/color";
import { themeFromSwatches } from "../../features/theme/studio/image-palette";
export const MAX_IMAGE_BYTES=4*1024*1024;
export const MAX_IMAGE_PIXELS=40_000_000;
export async function readImageUpload(request: Request): Promise<File> {
 const type = request.headers.get("content-type") ?? "";
 if (!type.toLowerCase().startsWith("multipart/form-data;")) throw new AppError("invalid-request", "Upload an image as multipart form data.");
 const bytes = await readLimitedBody(request, MAX_IMAGE_BYTES + 65536, "Images are limited to 4 MB.");
 const form = await new Response(bytes, { headers: { "content-type": type } }).formData().catch(() => null);
 const file = form?.get("file");
 if (!(file instanceof File)) throw new AppError("invalid-request", "Select an image file.");
 return file;
}
const MIME_TYPES=new Set(["image/jpeg","image/png","image/webp"]);
export async function imagePalette(file:File) {
 if(!MIME_TYPES.has(file.type))throw new AppError("invalid-request","Upload a JPEG, PNG, or WebP image.");
 if(file.size===0)throw new AppError("invalid-request","The image is empty.");
 if(file.size>MAX_IMAGE_BYTES)throw new AppError("payload-too-large","Images are limited to 4 MB.");
 try {
  const input=Buffer.from(await file.arrayBuffer());
  const decoded=sharp(input,{limitInputPixels:MAX_IMAGE_PIXELS,animated:false});
  const metadata=await decoded.metadata();
  if(!["jpeg","png","webp"].includes(metadata.format??""))throw new AppError("invalid-request","The file is not a supported image.");
  const thumbnail=await decoded.rotate().resize({width:256,height:256,fit:"inside",withoutEnlargement:true}).png().toBuffer();
  const palette=await new Vibrant(thumbnail).getPalette();
  const weighted=Object.values(palette).filter((swatch)=>swatch!==null).map((swatch)=>({ color:linearSrgbToOklch({r:gammaToLinear((swatch.rgb[0]??0)/255),g:gammaToLinear((swatch.rgb[1]??0)/255),b:gammaToLinear((swatch.rgb[2]??0)/255)}),weight:swatch.population }));
  if(!weighted.some((swatch)=>swatch.weight>0)) {
    const {data,info}=await sharp(thumbnail).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    let r=0,g=0,b=0,weight=0;
    for(let offset=0;offset<data.length;offset+=info.channels) {
      const alpha=(data[offset+3]??0)/255;
      r+=gammaToLinear((data[offset]??0)/255)*alpha;g+=gammaToLinear((data[offset+1]??0)/255)*alpha;b+=gammaToLinear((data[offset+2]??0)/255)*alpha;weight+=alpha;
    }
    if(weight===0)throw new AppError("invalid-request","The image has no visible colors.");
    weighted.push({color:linearSrgbToOklch({r:r/weight,g:g/weight,b:b/weight}),weight});
  }
  const theme=themeFromSwatches(weighted,`image-${crypto.randomUUID()}`,file.name.replace(/\.[^.]+$/,"")||"Image theme");
  const dominant=weighted.reduce((best,value)=>value.weight>best.weight?value:best);
  return { theme,seed:{hue:theme.ramp.hue,chroma:theme.ramp.chroma,torsion:theme.ramp.torsion??0},scheme:dominant.color.l<.5?"dark" as const:"light" as const,roles:theme.schemes.kind==="dual"?theme.schemes.light:{},swatches:weighted.map((swatch)=>swatch.color) };
 } catch(cause) {
  if(cause instanceof AppError)throw cause;
  throw new AppError("invalid-request","That image could not be decoded.",undefined,{cause});
 }
}
