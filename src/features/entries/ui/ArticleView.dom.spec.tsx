import {describe,expect,it,vi} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import type {ReactNode} from "react";
import type {LoadedEntry} from "../model/loaded";
import {parseLoadedEntry} from "../model/schema";
import {ArticleView} from "./ArticleView";

vi.mock("../../navigation",()=>({ArticleReadingContribution:()=>null}));
vi.mock("./ArticleActions",()=>({ArticleActions:()=>null}));
vi.mock("./AuthorLine",()=>({AuthorLine:()=>null}));
vi.mock("../../comments",()=>({Comments:()=>null}));
vi.mock("../../document",()=>({InlineMarks:({children}:{children:ReactNode})=><>{children}</>,renderDocument:()=>null}));
vi.mock("../../media",()=>({ImageViewer:({images}:{images:readonly {src:string}[]})=><div data-viewer-src={images.map(image=>image.src).join(",")}/> }));
const cover={src:"https://example.test/cover.jpg",alt:"Authored cover",width:800,height:600};
const fixture=(displayCover?:boolean):LoadedEntry=>parseLoadedEntry({section:"blog",slug:"hello",title:"Hello",publishedAt:"2024-01-02T00:00:00Z",unlisted:false,authors:[],tags:[],images:[],cover,extras:{section:"blog"},body:{kind:"none"},parsed:null,...(displayCover===undefined?{}:{displayCover})});

describe("authored opening-cover policy",()=>{
 it("keeps a listing cover but hides its opening viewer when explicitly disabled",()=>{
  const entry=fixture(false);
  expect(entry.cover).toEqual(cover);
  expect(renderToStaticMarkup(<ArticleView entry={entry}/>)).not.toContain("data-viewer-src");
 });
 it.each([true,undefined])("shows the opening cover when policy is %s",(policy)=>{
  expect(renderToStaticMarkup(<ArticleView entry={fixture(policy)}/>)).toContain(`data-viewer-src="${cover.src}"`);
 });
});
