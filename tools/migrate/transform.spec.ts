import { describe,it,expect } from "vitest";
import matter from "gray-matter";
import { transformObject,finalKey } from "./transform";
import { defaultSettings } from "../../src/features/settings/defaults";
import { migrateThemePreferences } from "../../src/features/theme/model/preferences";
import { defaultWorkspace } from "../../src/features/workspace/model";
const asset={src:"https://example.test/x.png",alt:"Alt",width:800,height:600};
const measure=async(src:string,alt:string,caption?:string,originalSrc?:string)=>({...asset,src,alt,...(caption===undefined?{}:{caption}),...(originalSrc===undefined?{}:{originalSrc})});
const legacy={title:"Hello",date:"2024-1-2",author:"Name",authorId:"person",description:"*bold*",tags:["tag",4],unlisted:true};
const native={section:"album",slug:"hello",title:"Hello",publishedAt:"2024-01-02T00:00:00Z",authors:[],tags:[],unlisted:false,images:[asset],extras:{section:"album"}};
const run=(key:string,value:unknown)=>transformObject(key,typeof value==="string"?value:JSON.stringify(value),measure);
describe("content transformation boundaries",()=>{
 it.each(["blog/comments/hello.json","photos/comments/hello.json","about/homepage/messages.json","home/messages.json"])("migrates legacy wrapped threads at %s without changing repeat-run identities",async(key)=>{
  const value={comments:[{author:"author-a",date:"2024-01-02",content:"*Hello*",likedBy:["reader-a"],replies:[{from:"author-b",to:"",date:"2024-01-03",content:"Reply"},{from:"author-a",to:"author-b",date:"2024-01-04",content:"Answer"}]}]};
  const result=await run(key,value);
  const thread=JSON.parse(result.outputs[0]!.body);
  expect(thread.comments[0]).toMatchObject({authorSub:"author-a",body:"**Hello**",likedBy:["reader-a"]});
  expect(thread.comments[0].replies[1].toId).toBe(thread.comments[0].replies[0].id);
  expect((await run(key,value)).outputs).toEqual(result.outputs);
  expect((await run(result.outputs[0]!.key,thread)).outputs).toEqual([]);
 });
 it("migrates the authored treeContent wrapper and retains privacy, positions and stable IDs",async()=>{
  const value={treeContent:[{uniqueId:"authored-id",from:"Author",message:"",date:"2024-01-02",position:[400,700],sprite:"star",isPublic:false,neverShowSpoilerWarning:true},{from:"Author",message:"Public",date:"2024-01-03",position:[500,700],sprite:"star",isPublic:true}]};
  const result=await run("special/christmas/tree.json",value);
  const board=JSON.parse(result.outputs[0]!.body);
  expect(board.messages[0]).toMatchObject({id:"authored-id",message:"",isPublic:false,neverShowSpoilerWarning:true,position:[400,700]});
  expect(board.messages[1]).toMatchObject({isPublic:true,neverShowSpoilerWarning:false});
  expect((await run("special/christmas/tree.json",value)).outputs).toEqual(result.outputs);
  expect((await run("special/christmas/tree.json",board)).outputs).toEqual([]);
  expect(JSON.parse((await run("special/christmas/tree.json",{treeContent:[]})).outputs[0]!.body).messages).toEqual([]);
  await expect(run("special/christmas/tree.json",{treeContent:"invalid"})).rejects.toThrow();
  await expect(run("blog/comments/hello.json",{schema:2,comments:value.treeContent})).rejects.toThrow();
 });
 it("expands authored project shorthand and preserves download link purpose",async()=>{
  const result=await run("projects/entries/notex.json",{...legacy,links:{github:"zimoluo/notex","zimo-blog":"single-page-theme-maker",download:"https://example.test/notex.zip",website:"https://example.test"}});
  const entry=JSON.parse(result.outputs[0]!.body);
  expect(entry.extras.links).toEqual([{label:"github",url:"https://github.com/zimoluo/notex",kind:"source"},{label:"zimo-blog",url:"/blog/single-page-theme-maker",kind:"article"},{label:"download",url:"https://example.test/notex.zip",kind:"download"},{label:"website",url:"https://example.test",kind:"other"}]);
  await expect(run("projects/entries/notex.json",{...legacy,links:{github:"../private"}})).rejects.toThrow("GitHub");
  await expect(run("projects/entries/notex.json",{...legacy,links:{"zimo-blog":"../private"}})).rejects.toThrow("slug");
 });
 it("keeps authored avatar filenames and photo profiles without manufacturing unknown avatars",async()=>{
  const blog=await run("blog/text/hello.md",matter.stringify("# Hello",{...legacy,author:"Eunoe",authorId:"eunoe.svg"}));
  expect(JSON.parse(blog.outputs[1]!.body).authors[0]).toMatchObject({id:"eunoe",name:"Eunoe",avatar:{src:"https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/author/eunoe.svg",width:800,height:600}});
  const profile="https://example.test/photos/profiles/zimo.png";
  const album=await run("photos/entries/hello.json",{...legacy,author:"Zimo",authorId:undefined,authorProfile:profile});
  expect(JSON.parse(album.outputs[0]!.body).authors[0].avatar.src).toBe(profile);
  const project=await run("projects/entries/hello.json",{title:"Hello",date:legacy.date,authors:["Kawarage"]});
  expect(JSON.parse(project.outputs[0]!.body).authors).toEqual([{id:"kawarage",name:"Kawarage"}]);
  const missing=await run("projects/entries/hello.json",{title:"Hello",date:legacy.date});
  expect(JSON.parse(missing.outputs[0]!.body).authors).toEqual([]);
  const known=await run("blog/text/hello.md",matter.stringify("# Hello",{...legacy,author:"Zimo",authorId:"zimo"}));
  expect(JSON.parse(known.outputs[1]!.body).authors[0].avatar.src).toBe("/util/zimo-default-profile.svg");
  const sentinel=await run("blog/text/hello.md",matter.stringify("# Hello",{...legacy,author:"Unknown",authors:["Unknown"],authorId:"unknown.jpeg",authorProfile:"https://example.test/unknown.jpeg",links:[]}));
  expect(JSON.parse(sentinel.outputs[1]!.body).authors[0].avatar.src).toBe("https://example.test/unknown.jpeg");
 });
 it("omits blank edited dates and interprets legacy timezone-free timestamps as UTC",async()=>{
  const result=await run("projects/entries/hello.json",{...legacy,date:"2022-11-27T08:00:00.000",lastEditedDate:"  "});
  const entry=JSON.parse(result.outputs[0]!.body);
  expect(entry.publishedAt).toBe("2022-11-27T08:00:00.000Z");
  expect(entry).not.toHaveProperty("updatedAt");
  const updated=await run("projects/entries/hello.json",{...legacy,updatedAt:"",lastEditedDate:"2024-01-03"});
  expect(JSON.parse(updated.outputs[0]!.body).updatedAt).toBe("2024-01-03T00:00:00.000Z");
 });
 it("blocks unsupported rich trees before emitting or measuring an empty replacement",async()=>{
  let measured=0;
  for(const content of [{body:[{type:"paragraph",children:[{text:"Authored prose"}]}]}, {content:["Keep",{type:"image"}]}]) {
   const result=await transformObject("blog/text/hello.json",JSON.stringify({...legacy,cover:{regular:asset.src},...content}),async()=>{measured+=1;return asset;});
   expect(result.outputs).toEqual([]);
   expect(result.issues).toEqual([{key:"blog/text/hello.json",message:"Unsupported legacy rich document tree; select the authored Markdown source instead",blocking:true}]);
  }
  expect(measured).toBe(0);
 });
 it("retains opening-cover policy while keeping the measured listing cover",async()=>{
  for(const displayCover of [false,true]) {
   const result=await run("blog/text/hello.md",matter.stringify("# Hello",{...legacy,coverImage:asset.src,displayCover}));
   const entry=JSON.parse(result.outputs[1]!.body);
   expect(entry.displayCover).toBe(displayCover);
   expect(entry.cover.src).toBe(asset.src);
  }
  const result=await run("projects/entries/hello.json",{...legacy,content:["# Hello"],cover:{regular:asset.src,displayAtBeginning:false}});
  expect(JSON.parse(result.outputs[0]!.body)).toMatchObject({cover:{src:asset.src},displayCover:false});
 });
 it.each([["photos/entries/a.json","album/entries/a.json"],["about/text/a.md","management/documents/a.md"],["about/comments/a.json","management/comments/a.json"],["about/likedBy/a.json","management/reactions/a.json"],["blog/likedBy/a.json","blog/reactions/a.json"],["about/homepage/messages.json","home/messages.json"],["about/aboutpage/intro.json","about/intro.json"],["unchanged/a.json","unchanged/a.json"]])("maps final storage key %s",(key,expected)=>expect(finalKey(key)).toBe(expected));
 it("preserves native entries, metadata, users and JSON object threads while validating them",async()=>{expect((await run("album/entries/hello.json",{...native,schema:2})).outputs).toEqual([]);expect((await run("blog/documents/hello.meta.json",{...native,section:"blog",extras:{section:"blog"}})).outputs).toEqual([]);expect((await run("blog/documents/hello.md",matter.stringify("# Hello",{formatVersion:2}))).outputs).toEqual([]);const user={name:"Name",profilePic:null,state:"normal",websiteSettings:defaultSettings,createdAt:"2024-01-01T00:00:00Z",updatedAt:"2024-01-01T00:00:00Z",syncedTheme:migrateThemePreferences({}),syncedWorkspace:defaultWorkspace};expect((await run("account/users/person.json",user)).outputs).toEqual([]);expect((await run("blog/comments/hello.json",{comments:[]})).outputs).toEqual([]);expect((await run("photos/comments/hello.json",{comments:[]})).outputs[0]?.key).toBe("album/comments/hello.json");expect((await run("blog/reactions/hello.json",{likedBy:[]})).outputs).toEqual([]);expect((await run("photos/likedBy/hello.json",{likedBy:[]})).outputs[0]?.key).toBe("album/reactions/hello.json");});
 it("migrates measured album captions/originals, locations and authored ratio warnings",async()=>{const result=await run("photos/entries/hello.json",{...legacy,location:{latitude:1,longitude:2,name:"Place"},instagramLink:"https://instagram.com/x",images:{url:[asset.src],text:["*caption*"],original:["https://example.test/original.png"],aspectRatio:"16:9"}});const entry=JSON.parse(result.outputs[0]!.body);expect(entry.extras.place.name).toBe("Place");expect(entry.extras.instagramUrl).toContain("instagram");expect(entry.images[0]).toMatchObject({width:800,height:600,caption:"**caption**",originalSrc:"https://example.test/original.png"});expect(result.issues.some(issue=>issue.message.includes("ratio"))).toBe(true);});
 it("retains existing image/cover assets and resolves object authors without invented fallback images",async()=>{const result=await run("album/entries/hello.json",{...legacy,images:[asset],cover:asset,authors:[{id:"person",name:"Person"}]});const entry=JSON.parse(result.outputs[0]!.body);expect(entry.images).toEqual([asset]);expect(entry.cover).toEqual(asset);expect(entry.authors[0].name).toBe("Person");});
 it("normalizes project link kinds, dates, authors and optional image omissions",async()=>{const result=await run("projects/entries/hello.json",{...legacy,publishedAt:"2024-01-02T05:00:00+05:00",lastEditedDate:"2024-01-03",authors:["One","Two"],content:["# Hello","*body*"],links:{source:"https://gitlab.com/x/y",store:"https://apps.apple.com/x",other:"https://example.test"}});const entry=JSON.parse(result.outputs[0]!.body);expect(entry.extras.links.map((link:{kind:string})=>link.kind)).toEqual(["source","store","other"]);expect(entry.images).toEqual([]);expect(entry.updatedAt).toBe("2024-01-03T00:00:00.000Z");expect(entry.publishedAt).toBe("2024-01-02T00:00:00.000Z");expect(entry.authors).toHaveLength(2);});
 it("normalizes management document cover identity and rejects document parser issues",async()=>{const result=await run("about/text/hello.md",matter.stringify("# Hello",{...legacy,coverImage:"/cover.png",lastEditedDate:"2024-01-03"}));const metadata=JSON.parse(result.outputs[1]!.body);expect(metadata.cover.src).toContain("/blog/posts/hello/cover.png");expect(result.outputs[0]?.key).toBe("management/documents/hello.md");const invalid=await run("blog/text/hello.md",matter.stringify('::article-card{slug="hello"}',{...legacy,coverImage:asset.src}));expect(invalid.issues.some(issue=>issue.blocking)).toBe(true);});
 it("reports missing authored alt text and unconvertible legacy directives",async()=>{const result=await run("blog/text/hello.md",matter.stringify("![ ](https://example.test/a.png)\n\n&&{Unrecognized}{\"a\":1}&&",legacy));expect(result.issues.some(issue=>issue.blocking)).toBe(true);const album=await run("photos/entries/hello.json",{...legacy,images:{url:[asset.src],aspectRatio:"invalid"}});expect(album.issues.some(issue=>!issue.blocking&&issue.message.includes("alt"))).toBe(true);});
 it("migrates legacy users with null or absent settings and preserves notebook intent",async()=>{for(const settings of [null,undefined,{notebookData:[{content:"abc",date:"2024-01-02",contentStyles:[{fromIndex:2,toIndex:2,style:"bold"}]}],notebookIndex:0}]){const result=await run("account/users/person.json",{name:"Name",state:"banned",profilePic:null,websiteSettings:settings});const user=JSON.parse(result.outputs[0]!.body);expect(user.state).toBe("banned");expect(user.syncedTheme.revision).toBe(0);if(settings!=null)expect(user.syncedWorkspace.notebook.pages[0].spans[0]).toMatchObject({from:2,to:3,style:"bold"});else expect(user.websiteSettings).toBeNull();}});
 it("migrates home references, introductions and tree privacy fields idempotently",async()=>{const home=await run("about/homepage/slide.json",{featured:[{section:"photos",slug:"hello"},{slug:"hello"}],timeline:[]});const value=JSON.parse(home.outputs[0]!.body);expect(value.featured.map((entry:{section:string})=>entry.section)).toEqual(["album","blog"]);expect((await run("home/slide.json",value)).outputs).toEqual([]);const intro=await run("about/aboutpage/intro.json",{intro:["*bold*",8]});expect(JSON.parse(intro.outputs[0]!.body).intro).toEqual(["**bold**"]);expect((await run("about/intro.json",JSON.parse(intro.outputs[0]!.body))).outputs).toEqual([]);const tree=await run("special/christmas/tree.json",[{from:"Name",message:"Private",date:"2024-01-02",position:[500,700],sprite:"star",neverShowSpoilerWarning:true},{uniqueId:"existing",from:"Name",message:"Public",date:"2024-01-02",position:[400,700],sprite:"star",isPublic:true}]);const board=JSON.parse(tree.outputs[0]!.body);expect(board.messages[0]).toMatchObject({isPublic:false,neverShowSpoilerWarning:true});expect(board.messages[1].id).toBe("existing");expect((await run("special/christmas/tree.json",board)).outputs).toEqual([]);expect((await run("about/homepage/other.json",{})).outputs[0]?.key).toBe("home/other.json");expect((await run("home/other.json",{})).outputs).toEqual([]);});
 it("rejects malformed objects/timestamps/slugs before output mutation",async()=>{await expect(run("projects/entries/hello.json",[])).rejects.toThrow("object");await expect(run("projects/entries/hello.json",{...legacy,date:"invalid"})).rejects.toThrow("timestamp");await expect(run("projects/entries/INVALID.json",legacy)).rejects.toThrow();await expect(run("blog/comments/hello.json",{messages:[]})).rejects.toThrow();await expect(run("special/christmas/tree.json",[{from:"",date:"2024-01-02"}])).rejects.toThrow();});
});
