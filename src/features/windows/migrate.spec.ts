import { describe, expect, it } from "vitest";
import { migrateWindowLayout } from "./migrate";
const saved=(key:string,props:Readonly<Record<string,unknown>>={},order=0)=>({centerX:200,centerY:300,width:280,height:200,order,data:{saveComponentKey:key},initialProps:props});
describe("legacy window migration",()=>{
  it("preserves notes, calculator input, entry selection and stacking order",()=>{
    const migrated=migrateWindowLayout({viewport:{width:1200,height:800},windows:[saved("stickyNotes",{storedText:"Do not lose this note"},3),saved("calculator",{presetExpression:["3","+","4"],presetHistory:"2+2"},1),saved("blog",{presetSlug:"a-post"},2)]});
    expect(migrated.issues).toEqual([]);
    expect(migrated.layout?.windows).toMatchObject([
      {definitionId:"calculator",props:{presetExpression:["3","+","4"],presetHistory:"2+2"}},
      {definitionId:"blog-reader",props:{section:"blog",slug:"a-post"}},
      {definitionId:"sticky-note",props:{text:"Do not lose this note"},group:1,rect:{x:60,y:200,width:280,height:200}},
    ]);
  });
  it("reports unreadable and unknown windows while preserving the usable ones",()=>{
    const result=migrateWindowLayout({viewport:{width:1200,height:800},windows:[saved("deleted-tool"),null,saved("notebook")]});
    expect(result.issues).toHaveLength(2);expect(result.layout?.windows).toHaveLength(1);
  });
});
