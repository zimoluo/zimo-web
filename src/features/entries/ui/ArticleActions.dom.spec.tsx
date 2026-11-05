import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { ArticleActions } from "./ArticleActions";
import { requireSlug } from "../model/ids";
import type { Entry } from "../model/types";

vi.mock("../../notifications", () => ({ notify: vi.fn() }));
const entry: Entry = { section:"blog", slug:requireSlug("article"), title:"A story", publishedAt:"2026-01-01T00:00:00Z", unlisted:false, tags:[], authors:[], images:[], extras:{section:"blog"}, body:{kind:"none"} };
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT:true });

describe("contained sharing controls", () => {
  it("dismisses its own menu before Escape can close the reader and preserves outside focus", async () => {
    const host=document.createElement("div"); document.body.append(host); const root=createRoot(host),escape=vi.fn();
    try {
      await act(async()=>root.render(<div onKeyDown={escape}><ArticleActions entry={entry}/><input aria-label="Outside"/></div>));
      const menu=host.querySelector("details")!,summary=menu.querySelector("summary")!,input=host.querySelector("input")!;
      menu.open=true; const link=menu.querySelector<HTMLAnchorElement>("a")!;link.focus();
      await act(async()=>link.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true,cancelable:true})));
      expect(menu.open).toBe(false);expect(escape).not.toHaveBeenCalled();expect(document.activeElement).toBe(summary);
      menu.open=true;await act(async()=>input.dispatchEvent(new MouseEvent("pointerdown",{bubbles:true})));
      expect(menu.open).toBe(false);input.focus();expect(document.activeElement).toBe(input);
      menu.open=true;link.focus();input.focus();expect(menu.open).toBe(false);
    } finally {await act(async()=>root.unmount());host.remove();}
  });
});
