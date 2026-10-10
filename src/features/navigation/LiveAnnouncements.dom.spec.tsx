import {act} from "react";
import {createRoot} from "react-dom/client";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {useTheme} from "../theme";
import {LiveAnnouncements} from "./LiveAnnouncements";
const route=vi.hoisted(()=>({pathname:"/"}));
vi.mock("next/navigation",()=>({usePathname:()=>route.pathname}));
let host:HTMLDivElement,root:ReturnType<typeof createRoot>;
beforeEach(()=>{route.pathname="/";useTheme.setState({active:{kind:"builtIn",id:"home"},scheme:"light",profiles:[]});host=document.createElement("div");document.body.append(host);root=createRoot(host);vi.useFakeTimers();});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.useRealTimers();});
describe("discrete assistive announcements",()=>{
 it("announces active scheme changes without publishing profile edits",async()=>{
  useTheme.setState({active:{kind:"builtIn",id:"memories"}});
  await act(async()=>root.render(<LiveAnnouncements/>));
  expect(host.textContent).toBe("");
  await act(async()=>useTheme.getState().setScheme("dark"));
  expect(host.textContent).toBe("Theme: Memories, dark scheme");
  const region=host.querySelectorAll("[role=status]")[1];
  const mutation=vi.fn(),observer=new MutationObserver(mutation);if(region)observer.observe(region,{childList:true});
  await act(async()=>useTheme.setState({profiles:[]}));
  expect(mutation).not.toHaveBeenCalled();observer.disconnect();
 });
 it("announces a destination only after navigation and uses the document title for articles",async()=>{
  await act(async()=>root.render(<LiveAnnouncements/>));
  route.pathname="/notebook";await act(async()=>root.render(<LiveAnnouncements/>));await act(async()=>vi.advanceTimersByTime(20));
  expect(host.querySelector("[role=status]")?.textContent).toBe("Notebook");
  document.title="A thoughtful article";route.pathname="/blog/a-thoughtful-article";await act(async()=>root.render(<LiveAnnouncements/>));await act(async()=>vi.advanceTimersByTime(20));
  expect(host.querySelector("[role=status]")?.textContent).toBe("A thoughtful article");
 });
});
