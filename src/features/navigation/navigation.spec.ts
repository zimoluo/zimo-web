import {describe,expect,it,vi} from "vitest";
import {selectContribution,useStrip} from "./contributions";
import {shouldRouteToStrip} from "./routing";
describe("context selection",()=>{
 it("preempts reading with confirmation and breaks ties by registration order",()=>{const items={reading:{id:"reading",priority:40,label:"Article",order:0},first:{id:"first",priority:100,label:"Saved",order:1},second:{id:"second",priority:100,label:"Copied",order:2}};expect(selectContribution(items)?.id).toBe("first");expect(selectContribution({reading:items.reading})?.id).toBe("reading");});
 it("routes only short neutral notifications without an action",()=>{expect(shouldRouteToStrip({title:"Saved",duration:2000})).toBe(true);expect(shouldRouteToStrip({title:"Saved"})).toBe(false);expect(shouldRouteToStrip({title:"Saved",duration:null})).toBe(false);expect(shouldRouteToStrip({title:"Problem",tone:"warning",duration:2000})).toBe(false);expect(shouldRouteToStrip({title:"Saved",duration:2000,action:{label:"Open",href:"/"}})).toBe(false);});
});

describe("transient context contribution lifetime",()=>{
 it("returns to persistent context after confirmation TTL and keeps newer replacements",()=>{
  vi.useFakeTimers();
  useStrip.setState({items:{}});
  const reading=useStrip.getState().register({id:"reading",priority:40,label:"Reading"});
  const first=useStrip.getState().register({id:"confirmation",priority:100,label:"Saved",ttl:2000});
  expect(selectContribution(useStrip.getState().items)?.label).toBe("Saved");
  vi.advanceTimersByTime(2000);
  expect(selectContribution(useStrip.getState().items)?.label).toBe("Reading");
  const newer=useStrip.getState().register({id:"reading",priority:40,label:"New article"});
  reading();
  expect(selectContribution(useStrip.getState().items)?.label).toBe("New article");
  newer();first();vi.useRealTimers();
 });
});

import { useNavigationUi } from "./store";
it("starts each command session with a fresh query and selection", () => {
 const state=useNavigationUi.getState(); state.setPaletteOpen(false); state.setPaletteOpen(true);
 state.setPaletteQuery("previous search"); state.setPaletteActive(7); state.setPaletteOpen(false);
 expect(useNavigationUi.getState().paletteQuery).toBe("previous search");
 state.setPaletteOpen(true); expect(useNavigationUi.getState().paletteQuery).toBe(""); expect(useNavigationUi.getState().paletteActive).toBe(0);
 state.setPaletteOpen(false);
});
