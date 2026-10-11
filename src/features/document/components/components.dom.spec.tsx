import {act} from "react";
import {createRoot} from "react-dom/client";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {parseSlug} from "../../entries/model/ids";
import {entryPath} from "../../entries/paths";
import {parseEntrySummary} from "../../entries/model/schema";
import {fetchSummaries} from "../../entries";
import {useTheme} from "../../theme";
import {useStrip} from "../../navigation/contributions";
import {ContextStrip} from "../../navigation/ContextStrip";
import {InlineMarks} from "./InlineMarks";
import {DirectiveCard} from "./DirectiveCard";
import {DocumentMusicPlayer} from "./DocumentMusicPlayer";
import {ThemePicker} from "./ThemePicker";
vi.mock("../../entries",()=>({fetchSummaries:vi.fn(),parseSlug,entryPath}));
let host:HTMLDivElement,root:ReturnType<typeof createRoot>;
beforeEach(()=>{vi.clearAllMocks();host=document.createElement("div");document.body.append(host);root=createRoot(host);vi.mocked(fetchSummaries).mockResolvedValue([]);useStrip.setState({items:{}});useTheme.setState({active:{kind:"builtIn",id:"home"},scheme:"light",profiles:[]});});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
describe("authored inline marks",()=>{
 it("preserves nested emphasis, mark, code and strike, with safe external link attributes",async()=>{
  await act(async()=>root.render(<InlineMarks>{"Plain *em **strong*** `code` ==highlight== ~~old~~ [external](https://example.com) [http](http://example.com) [local](/blog)"}</InlineMarks>));
  expect(host.querySelector("em strong")?.textContent).toBe("strong");
  expect(host.querySelector("code")?.textContent).toBe("code");expect(host.querySelector("mark")?.textContent).toBe("highlight");expect(host.querySelector("s")?.textContent).toBe("old");
  const links=host.querySelectorAll("a");expect(links[0]?.getAttribute("rel")).toBe("noopener noreferrer");expect(links[1]?.target).toBe("_blank");expect(links[2]?.hasAttribute("target")).toBe(false);
 });
});
describe("public embedded article references",()=>{
 it("loads the canonical album summary and aborts its request on unmount",async()=>{
  const entry=parseEntrySummary({section:"album",slug:"a-photo",title:"**A photo**",description:"An *authored* caption",publishedAt:"2026-08-01T00:00:00Z",unlisted:false,tags:[],authors:[]});vi.mocked(fetchSummaries).mockResolvedValue([entry]);
  await act(async()=>root.render(<DirectiveCard section="photos" slug="a-photo"/>));
  expect(fetchSummaries).toHaveBeenCalledWith("album",expect.any(AbortSignal));expect(host.querySelector("a")?.getAttribute("href")).toBe("/album/a-photo");expect(host.querySelector("h3 strong")?.textContent).toBe("A photo");expect(host.querySelector("p em")?.textContent).toBe("authored");
  const signal=vi.mocked(fetchSummaries).mock.calls.at(-1)?.[1];await act(async()=>root.render(null));expect(signal?.aborted).toBe(true);
 });
 it.each(["projects","management","unknown"])("preserves a usable %s link when the public summary is missing",async(section)=>{
  await act(async()=>root.render(<DirectiveCard section={section} slug="missing-entry"/>));expect(host.querySelector("a")?.getAttribute("href")).toBe(`/${section==="unknown"?"blog":section}/missing-entry`);expect(host.querySelector("h3")?.textContent).toBe("missing entry");expect(host.querySelector("p")).toBeNull();
 });
 it("keeps a usable link when the summary request fails",async()=>{
  vi.mocked(fetchSummaries).mockRejectedValue(new Error("Unavailable"));await act(async()=>root.render(<DirectiveCard slug="offline-entry"/>));expect(host.querySelector("a")?.getAttribute("href")).toBe("/blog/offline-entry");
 });
 it.each([undefined,23,"../../private"])("makes invalid references visible without issuing a request",async(slug)=>{
  await act(async()=>root.render(<DirectiveCard slug={slug}/>));expect(host.querySelector('[role="note"]')?.textContent).toContain("invalid slug");expect(fetchSummaries).not.toHaveBeenCalled();
 });
});
describe("native document controls",()=>{
 it("reveals controls when metadata loaded before mounting",async()=>{
  vi.spyOn(HTMLMediaElement.prototype,"readyState","get").mockReturnValue(1);
  vi.spyOn(HTMLMediaElement.prototype,"duration","get").mockReturnValue(120);
  await act(async()=>root.render(<DocumentMusicPlayer url="/cached.mp3" title="Cached track"/>));
  const play=host.querySelector('[aria-label="Play track"]');
  expect(play?.closest('[class*="controlBar"]')?.className).toContain("opacity-100");
  expect(host.querySelector('[role="slider"]')?.getAttribute("aria-valuemax")).toBe("120");
 });
 it("lets a custom-profile reader select a built-in theme",async()=>{
  useTheme.setState({active:{kind:"profile",index:0}});await act(async()=>root.render(<ThemePicker/>));const select=host.querySelector("select");expect(select?.value).toBe("");expect(select?.selectedOptions[0]?.textContent).toBe("Custom theme");if(!select)throw new Error("Missing theme picker");select.value="velvet";await act(async()=>select.dispatchEvent(new Event("change",{bubbles:true})));expect(useTheme.getState().active).toEqual({kind:"builtIn",id:"velvet"});
 });
 it("contributes only playing media and exposes a working pause action",async()=>{
  const pause=vi.spyOn(HTMLMediaElement.prototype,"pause").mockImplementation(()=>{});await act(async()=>root.render(<><DocumentMusicPlayer url="/audio.mp3" title="Forecast" author="Kevin"/><ContextStrip/></>));const audio=host.querySelector("audio");if(!audio)throw new Error("Missing audio");expect(audio.preload).toBe("metadata");expect(audio.controls).toBe(false);expect(host.querySelector("button[aria-label=\"Play track\"]")).not.toBeNull();expect(Object.values(useStrip.getState().items)).toHaveLength(0);await act(async()=>audio.dispatchEvent(new Event("play")));expect(Object.values(useStrip.getState().items)[0]?.label).toBe("Forecast — Kevin");const button=host.querySelector<HTMLButtonElement>('[aria-label="Pause Forecast"]');await act(async()=>button?.click());expect(pause).toHaveBeenCalledOnce();await act(async()=>audio.dispatchEvent(new Event("pause")));expect(Object.values(useStrip.getState().items)).toHaveLength(0);await act(async()=>audio.dispatchEvent(new Event("play")));await act(async()=>audio.dispatchEvent(new Event("ended")));expect(Object.values(useStrip.getState().items)).toHaveLength(0);
 });
 it("keeps the authored audio controls keyboard-operable",async()=>{
  await act(async()=>root.render(<DocumentMusicPlayer url="/audio.mp3" title="Track"/>));
  const audio=host.querySelector("audio");if(!audio)throw new Error("Missing audio");
  Object.defineProperty(audio,"duration",{value:120,configurable:true});
  await act(async()=>audio.dispatchEvent(new Event("loadedmetadata")));
  const slider=host.querySelector('[role="slider"]');
  await act(async()=>slider?.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true})));
  expect(audio.currentTime).toBe(5);
  await act(async()=>host.querySelector<HTMLButtonElement>('[aria-label="Slow down"]')?.click());
  expect(audio.playbackRate).toBe(.75);
  await act(async()=>host.querySelector<HTMLButtonElement>('[aria-label="Loop track"]')?.click());
  expect(audio.loop).toBe(true);
 });
 it("renders authorless music without adding punctuation to its contribution",async()=>{
  await act(async()=>root.render(<DocumentMusicPlayer url="/audio.mp3" title="Solo"/>));await act(async()=>host.querySelector("audio")?.dispatchEvent(new Event("play")));expect(Object.values(useStrip.getState().items)[0]?.label).toBe("Solo");expect(host.querySelector("h2")?.textContent).toBe("Solo");
 });
});
