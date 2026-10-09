import { describe,it,expect } from "vitest";
import { requireSameOrigin,readLimitedJson } from "./same-origin";
const make=(headers:Record<string,string>,body="{}")=>new Request("https://example.test/api/v1/me/settings",{method:"POST",headers,body});
const valid={origin:"https://example.test","content-type":"application/json"};
describe("settings beacon boundary",()=>{
 it("accepts a JSON request from its own origin",async()=>{const request=make(valid);expect(()=>requireSameOrigin(request)).not.toThrow();expect(await readLimitedJson(request)).toEqual({});});
 it.each([{}, {...valid,origin:"https://evil.test"},{...valid,"sec-fetch-site":"cross-site"},{...valid,"content-type":"text/plain"}])("rejects CSRF or a simple-form content type",(headers)=>expect(()=>requireSameOrigin(make(headers))).toThrow());
 it("limits streamed body bytes even without a declared length",async()=>{await expect(readLimitedJson(make(valid,JSON.stringify({text:"abcdefgh"})),8)).rejects.toMatchObject({code:"payload-too-large"});});
 it("rejects malformed JSON",async()=>{await expect(readLimitedJson(make(valid,"bad"))).rejects.toMatchObject({code:"invalid-request"});});
});
