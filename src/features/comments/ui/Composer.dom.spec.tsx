import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe,it,expect,vi } from "vitest";
import { Composer } from "./Composer";
describe("comment draft recovery",()=>{
 it("retains authored text after failure and clears it only after success",async()=>{
  const container=document.createElement("div");document.body.append(container);const root=createRoot(container);
  const submit=vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  await act(async()=>root.render(<Composer label="Comment" disabled={false} onSubmit={submit}/>));
  const textarea=container.querySelector("textarea")!,form=container.querySelector("form")!;
  await act(async()=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")!.set!.call(textarea,"Keep this draft");textarea.dispatchEvent(new Event("input",{bubbles:true}));});
  await act(async()=>{form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));});
  expect(textarea.value).toBe("Keep this draft");expect(submit).toHaveBeenCalledWith("Keep this draft");
  await act(async()=>{form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));});
  expect(textarea.value).toBe("");await act(async()=>root.unmount());container.remove();
 });
 it("sends with Enter while Shift Enter preserves a multiline draft",async()=>{
  const container=document.createElement("div");document.body.append(container);const root=createRoot(container);const submit=vi.fn().mockResolvedValue(false);
  try {
   await act(async()=>root.render(<Composer label="Comment" disabled={false} onSubmit={submit}/>));
   const textarea=container.querySelector("textarea")!;
   await act(async()=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")!.set!.call(textarea,"First line");textarea.dispatchEvent(new Event("input",{bubbles:true}));});
   await act(async()=>textarea.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",shiftKey:true,bubbles:true,cancelable:true})));
   expect(submit).not.toHaveBeenCalled();
   await act(async()=>textarea.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true,cancelable:true})));
   expect(submit).toHaveBeenCalledWith("First line");expect(textarea.value).toBe("First line");
  } finally {await act(async()=>root.unmount());container.remove();}
 });
 it("keeps the signed out composer visible and directs sign in through its own control",async()=>{
  const container=document.createElement("div");document.body.append(container);const root=createRoot(container);const signIn=vi.fn(),submit=vi.fn();
  try {
   await act(async()=>root.render(<Composer label="Sign in to comment" disabled onSubmit={submit} onSignIn={signIn}/>));
   expect(container.querySelector("textarea")?.disabled).toBe(true);
   await act(async()=>container.querySelector<HTMLButtonElement>('button[aria-label="Sign in to comment"]')!.click());
   expect(signIn).toHaveBeenCalledOnce();expect(submit).not.toHaveBeenCalled();
  } finally {await act(async()=>root.unmount());container.remove();}
 });

 it("owns one pending send and preserves edits made before its response",async()=>{
  const container=document.createElement("div");document.body.append(container);const root=createRoot(container);
  let resolve!:(saved:boolean)=>void;const submit=vi.fn(()=>new Promise<boolean>(done=>{resolve=done;}));
  const input=async(value:string)=>act(async()=>{const area=container.querySelector("textarea")!;Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")!.set!.call(area,value);area.dispatchEvent(new Event("input",{bubbles:true}));});
  try {
   await act(async()=>root.render(<Composer label="Comment" disabled={false} onSubmit={submit}/>));await input("Submitted draft");
   await act(async()=>{const form=container.querySelector("form")!;form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));});
   expect(submit).toHaveBeenCalledOnce();expect(container.querySelector("form")?.getAttribute("aria-busy")).toBe("true");
   await input("Next thought");await act(async()=>resolve(true));
   expect(container.querySelector("textarea")?.value).toBe("Next thought");expect(container.querySelector("form")?.getAttribute("aria-busy")).toBe("false");
  } finally {await act(async()=>root.unmount());container.remove();}
 });
 it("keeps a rejected send recoverable without an unhandled promise",async()=>{
  const container=document.createElement("div");document.body.append(container);const root=createRoot(container);const submit=vi.fn().mockRejectedValueOnce(new Error("Offline")).mockResolvedValue(true);
  try {
   await act(async()=>root.render(<Composer label="Comment" disabled={false} onSubmit={submit}/>));const area=container.querySelector("textarea")!,form=container.querySelector("form")!;
   await act(async()=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")!.set!.call(area,"Keep me");area.dispatchEvent(new Event("input",{bubbles:true}));});
   await act(async()=>{form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));});expect(area.value).toBe("Keep me");expect(container.querySelector('[role=alert]')?.textContent).toContain("draft is kept");
   await act(async()=>{form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));});expect(area.value).toBe("");expect(container.querySelector('[role=alert]')).toBeNull();
  } finally {await act(async()=>root.unmount());container.remove();}
 });

});
