import { describe,it,expect } from "vitest";
import sharp from "sharp";
import { imagePalette,readImageUpload,MAX_IMAGE_BYTES } from "./image-palette";
import { themeSourceSchema } from "../../features/theme/model/schema";
describe("image theme extraction",()=>{
 it("produces a validated theme and perceptual swatches from a decoded image",async()=>{
  const pixels=await sharp({create:{width:32,height:32,channels:3,background:{r:190,g:80,b:120}}}).png().toBuffer();
  const result=await imagePalette(new File([pixels],"rose.png",{type:"image/png"}));
  expect(themeSourceSchema.safeParse(result.theme).success).toBe(true);expect(result.swatches.length).toBeGreaterThan(0);expect(result.seed.hue).toBeGreaterThanOrEqual(0);expect(result.seed.hue).toBeLessThan(360);expect(["light","dark"]).toContain(result.scheme);
 });
 it.each([0,128,255])("accepts a grayscale image with channel %s",async(channel)=>{
  const pixels=await sharp({create:{width:16,height:16,channels:3,background:{r:channel,g:channel,b:channel}}}).png().toBuffer();
  const result=await imagePalette(new File([pixels],"gray.png",{type:"image/png"})); expect(themeSourceSchema.safeParse(result.theme).success).toBe(true);
 });
 it("rejects mislabeled and oversized input before image processing",async()=>{
  await expect(imagePalette(new File(["broken"],"x.png",{type:"image/png"}))).rejects.toMatchObject({code:"invalid-request"});
  await expect(imagePalette(new File(["<svg/>"],"x.svg",{type:"image/svg+xml"}))).rejects.toMatchObject({code:"invalid-request"});
  await expect(imagePalette(new File([new Uint8Array(MAX_IMAGE_BYTES+1)],"x.png",{type:"image/png"}))).rejects.toMatchObject({code:"payload-too-large"});
 });
});


describe("image upload transport",()=>{
 it("reads the authored filename and bytes from a bounded multipart request",async()=>{
  const form=new FormData(); form.set("file",new File(["pixels"],"photo.png",{type:"image/png"}));
  const file=await readImageUpload(new Request("https://example.test/api/palette",{method:"POST",body:form}));
  expect(file.name).toBe("photo.png"); expect(file.type).toBe("image/png"); expect(await file.text()).toBe("pixels");
 });
 it("limits upload bytes without trusting the declared request length",async()=>{
  const request=new Request("https://example.test/api/palette",{method:"POST",headers:{"content-type":"multipart/form-data; boundary=x"},body:new Uint8Array(MAX_IMAGE_BYTES+65537)});
  await expect(readImageUpload(request)).rejects.toMatchObject({code:"payload-too-large"});
 });
 it("rejects an oversized declared upload before consuming it",async()=>{
  const request=new Request("https://example.test/api/palette",{method:"POST",headers:{"content-type":"multipart/form-data; boundary=x","content-length":String(MAX_IMAGE_BYTES+65537)},body:"small"});
  await expect(readImageUpload(request)).rejects.toMatchObject({code:"payload-too-large"});expect(request.bodyUsed).toBe(false);
 });
 it("rejects malformed multipart data and an absent image field",async()=>{
  const form=new FormData();form.set("text","value");
  await expect(readImageUpload(new Request("https://example.test/api/palette",{method:"POST",body:form}))).rejects.toMatchObject({code:"invalid-request"});
  await expect(readImageUpload(new Request("https://example.test/api/palette",{method:"POST",headers:{"content-type":"multipart/form-data; boundary=x"},body:"broken"}))).rejects.toMatchObject({code:"invalid-request"});
  await expect(readImageUpload(new Request("https://example.test/api/palette",{method:"POST",body:"text"}))).rejects.toMatchObject({code:"invalid-request"});
 });
});
