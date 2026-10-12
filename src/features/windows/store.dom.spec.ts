import { describe, expect, it, vi } from "vitest";
import { useWindows } from "./store";
import type { WindowId, WindowDefinitionId } from "./model";
import { emptyWindows } from "./model";
import { openWindowDefinition } from "./open";
import { useSettings } from "../settings";

describe("saved windows actually restore into the normalized runtime store",()=>{
  it("validates saved props, scales geometry and restores singleton identity",()=>{
    const merge = useWindows.persist.getOptions().merge;
    const current = {...useWindows.getState(),...emptyWindows()};
    const raw = {viewport:{width:window.innerWidth/2,height:window.innerHeight/2},windows:[
      {id:"saved",definitionId:"calculator",props:{presetExpression:["2","+","3"]},rect:{x:50,y:50,width:160,height:230},group:0},
      {id:"bad",definitionId:"blog-reader",props:{slug:"invalid"},rect:{x:50,y:50,width:160,height:230},group:0},
      {id:"unknown",definitionId:"removed-tool",props:{},rect:{x:50,y:50,width:160,height:230},group:0},
    ]};
    const restored = merge?.(raw,current);
    expect(restored?.order).toEqual(["saved"]);
    expect(restored?.instances.saved?.rect).toEqual({x:100,y:100,width:320,height:460});
    expect(restored?.instances.saved?.singletonKey).toBe("calculator");
  });
  it("returns the focused existing id when opening a singleton",()=>{
    useWindows.setState(emptyWindows());
    const request = {definitionId:"calculator" as WindowDefinitionId,props:{},rect:{x:100,y:100,width:320,height:460},singletonKey:"calculator"};
    const first=useWindows.getState().open(request);const second=useWindows.getState().open(request);
    expect(second).toBe(first);expect(useWindows.getState().order).toEqual([first]);
    useWindows.setState(emptyWindows());
  });
});

describe("window admission at the configured limit",()=>{
  it("keeps the picker and notes available and focuses an existing singleton",()=>{
    const preferences=useSettings.getState().windows;
    useWindows.setState(emptyWindows());useSettings.getState().setWindows({limit:1});
    const calculator=openWindowDefinition("calculator");
    expect(calculator).not.toBeNull();
    useWindows.getState().minimize(true);
    expect(openWindowDefinition("calculator")).toBe(calculator);
    expect(useWindows.getState().minimized).toBe(false);
    expect(openWindowDefinition("notebook")).toBeNull();
    expect(openWindowDefinition("window-picker")).not.toBeNull();
    expect(openWindowDefinition("sticky-note",{text:"Available at the limit"})).not.toBeNull();
    expect(useWindows.getState().order).toHaveLength(3);
    useWindows.setState(emptyWindows());useSettings.getState().setWindows(preferences);
  });
});


it("does not schedule persistence for unchanged or unknown focus", () => {
  const previous = useWindows.persist.getOptions().storage!;
  const storage = { getItem: () => null, setItem: vi.fn(), removeItem: vi.fn() };
  useWindows.persist.setOptions({ storage });
  try {
    useWindows.setState(emptyWindows());
    const id = useWindows.getState().open({ definitionId: "calculator" as WindowDefinitionId, rect: { x: 100, y: 100, width: 320, height: 460 } });
    storage.setItem.mockClear();
    useWindows.getState().focus(id); useWindows.getState().focus("missing" as WindowId);
    expect(storage.setItem).not.toHaveBeenCalled();
    useWindows.getState().minimize(true); storage.setItem.mockClear();
    useWindows.getState().focus(id);
    expect(useWindows.getState().minimized).toBe(false); expect(storage.setItem).toHaveBeenCalledOnce();
  } finally { useWindows.setState(emptyWindows()); useWindows.persist.setOptions({ storage: previous }); }
});
