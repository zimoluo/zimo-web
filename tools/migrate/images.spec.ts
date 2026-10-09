import { describe,it,expect,afterEach,vi } from "vitest";
import { readFileSync } from "node:fs";
import { measureImage } from "./images";
afterEach(()=>vi.unstubAllGlobals());
describe("migration image measurement",()=>{
 it("measures actual local dimensions and emits a decoded tiny placeholder",async()=>{const asset=await measureImage("/website-favicon/preview/favicon-32x32.png","Authored alt","Caption","https://example.test/original.png");expect(asset).toMatchObject({width:32,height:32,alt:"Authored alt",caption:"Caption",originalSrc:"https://example.test/original.png"});expect(asset.placeholder).toMatch(/^data:image\/webp;base64,/);});
 it("measures a successful remote image without requiring production access",async()=>{vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(readFileSync("public/website-favicon/preview/favicon-32x32.png"))));expect(await measureImage("https://example.test/image.png","Alt")).toMatchObject({width:32,height:32,alt:"Alt"});});
 it("rejects a path traversal, unsupported URL protocol, remote failure and corrupt bytes",async()=>{await expect(measureImage("/../../outside","Alt")).rejects.toThrow("escapes");await expect(measureImage("file:///etc/passwd","Alt")).rejects.toThrow("protocol");vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response("missing",{status:404})));await expect(measureImage("https://example.test/missing","Alt")).rejects.toThrow("404");vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response("bad image")));await expect(measureImage("https://example.test/broken","Alt")).rejects.toThrow();});
});
