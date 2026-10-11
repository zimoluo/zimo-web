import { describe, expect, it } from "vitest";
import { artworkColor, artworkCss, artworkFilter, artworkProperty, artworkUrl, type Artwork, type Paint } from "./artwork";
import { authoredPaint } from "./authored-shading";
import { resolve, getTheme } from "../../theme";
import { linearToGamma, oklchToLinearSrgb } from "../../theme/color";
const reference = { l:.6,c:.1,h:350 };
const paint: Paint = { color:{l:.7,c:.15,h:10},key:"mid",reference,alpha:.35 };
const artwork: Artwork = { kind:"vector",svg:'<svg><defs><linearGradient id="light"><stop stop-color="{{0}}"/></linearGradient></defs><path d="M0 0L10 10" fill="url(#light)" opacity=".4"/><style>path{animation:float 20s -4s linear infinite}@keyframes float{to{transform:translateX(10px)}}</style></svg>',paints:[paint] };
const svg = (url:string) => decodeURIComponent(url.slice('data:image/svg+xml,'.length));
describe("authored artwork palette adaptation",()=>{
 it("retains native paint, shading, opacity, geometry and animation definitions",()=>{
  expect(artworkColor(paint,{mid:reference})).toEqual(paint.color);
  const result=svg(artworkUrl("/original.svg",artwork,{mid:reference}));
  expect(result).toContain('oklch(0.7 0.15 10 / 0.35)');
  expect(result).toContain('d="M0 0L10 10"');expect(result).toContain('fill="url(#light)" opacity=".4"');expect(result).toContain('@keyframes float');
 });
 it("moves paint relative to the new palette across the hue seam",()=>{
  const color=artworkColor(paint,{mid:{l:.5,c:.05,h:10}});
  expect(color.l).toBeCloseTo(.6);expect(color.c).toBeCloseTo(.075);expect(color.h).toBe(30);
  expect(artworkCss(paint)).toContain('var(--zw-scene-mid, oklch(0.6 0.1 350))');
 });
 it("bounds extreme colors and supports neutral source colors",()=>{
  const neutral={...paint,reference:{l:.5,c:0,h:0}};
  expect(artworkColor(neutral,{mid:{l:1,c:.4,h:180}})).toEqual({l:1,c:.4,h:-170});
  expect(artworkColor(paint,{})).toEqual(paint.color);
 });
 it("changes embedded durations and delays together and freezes still artwork",()=>{
  expect(svg(artworkUrl("",artwork,{},2))).toContain('animation:float 10s -2s');
  expect(svg(artworkUrl("",artwork,{},.5))).toContain('animation:float 40s -8s');
  expect(svg(artworkUrl("",artwork,{},1,"still"))).toContain('animation-play-state:paused!important');
  expect(svg(artworkUrl("",artwork,{},0))).toContain('animation:float 400s -80s');
 });
 it("keeps raster texture intact with an identity native filter",()=>{
  const raster: Artwork={kind:"raster",reference};
  expect(artworkUrl("/original.png",raster,{})).toBe("/original.png");
  expect(artworkFilter(raster,{mid:reference})).toBe('hue-rotate(0deg) saturate(1) brightness(1)');
  expect(artworkFilter(raster,{mid:{l:.3,c:.2,h:10}})).toBe('hue-rotate(20deg) saturate(2) brightness(0.5)');
  expect(artworkFilter(artwork,{})).toBe("none");
  expect(artworkProperty("/theme/animated-background/home/home.svg")).toBe("--zw-artwork-home-home-svg");
 });
 it.each([
  ["velvet","base",[.165,.11,.239]],
  ["whiteout","highlight",[.792,.807,.89]],
  ["planetoid","accent",[.137,.271,0]],
 ] as const)("preserves the original %s shader paint in its native palette",(id,key,rgb)=>{
  const source=getTheme(id);const palette=resolve(source,source.surfaceScheme??"dark").backdrop!.scenes[0]!.palette;
  const linear=oklchToLinearSrgb(artworkColor(authoredPaint(id,key,rgb),palette));
  expect(linearToGamma(linear.r)).toBeCloseTo(rgb[0],5);expect(linearToGamma(linear.g)).toBeCloseTo(rgb[1],5);expect(linearToGamma(linear.b)).toBeCloseTo(rgb[2],5);
 });
});
