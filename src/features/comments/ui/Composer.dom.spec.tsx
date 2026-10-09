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
});
