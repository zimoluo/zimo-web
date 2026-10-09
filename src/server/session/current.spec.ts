import { beforeEach,describe,it,expect,vi } from "vitest";
import { signSession,secretFrom } from "./token";
const state=vi.hoisted(()=>({token:undefined as string|undefined,user:null as {state:"normal"|"banned"|"admin"}|null}));
vi.mock("next/headers",()=>({cookies:async()=>({get:(name:string)=>name==="session"&&state.token!==undefined?{value:state.token}:undefined,set:vi.fn()})}));
vi.mock("../storage/object",()=>({objects:()=>({readJson:async()=>state.user===null?null:{value:state.user,etag:"v1"}})}));
import { currentViewer,requireCurrentViewer } from "./current";
const secret="session-integration-secret-long-enough";
beforeEach(()=>{process.env.ZIMO_WEB_JWT_KEY=secret;state.token=undefined;state.user=null;});
describe("session account validation",()=>{
 it("requires a live stored account even with a valid signed token",async()=>{state.token=await signSession("deleted",secretFrom(secret));expect(await currentViewer()).toBeNull();await expect(requireCurrentViewer()).rejects.toMatchObject({code:"unauthenticated"});});
 it("rejects tampered tokens before account lookup",async()=>{state.user={state:"admin"};state.token=(await signSession("person",secretFrom(secret)))+"tampered";expect(await currentViewer()).toBeNull();});
 it("reads the stored ban state rather than trusting token claims",async()=>{state.token=await signSession("person",secretFrom(secret));state.user={state:"banned"};expect(await currentViewer()).toEqual({sub:"person",state:"banned"});});
});
