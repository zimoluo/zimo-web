import type { ResolvedMark } from "../model/resolved-theme";
import { MARK_VIEWBOX, MARK_OUTLINE, gradientVector, gradientsFor, regionPaths, stopVariable } from "./geometry";
export type MarkProps = { readonly mark: ResolvedMark; readonly size?: number | string; readonly title?: string; readonly className?: string; readonly id?: string };
let nextId = 0;
export function MarkDefs() { return null; }
export function Mark({ mark, size = "1em", title, className, id: prefix }: MarkProps) {
  const id = prefix ?? `zw-server-mark-${++nextId}`;
  const gradients = gradientsFor(mark);
  return <svg viewBox={`0 0 ${MARK_VIEWBOX} ${MARK_VIEWBOX}`} width={size} height={size} className={className} role={title ? "img" : "presentation"} aria-hidden={title ? undefined : true} focusable="false">
    {title && <title>{title}</title>}
    <defs>{gradients.map((gradient, region) => <linearGradient key={region} id={`${id}-${region}`} {...gradientVector(gradient)}>{gradient.stops.map((stop, index) => <stop key={index} offset={stop.offset} stopColor={`var(${stopVariable(region, index)}, currentColor)`} />)}</linearGradient>)}</defs>
    {mark.mode === "backdrop" ? <foreignObject x={32} y={32} width={960} height={960}><div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundImage: "var(--zw-surface-page-image)" }} /></foreignObject> : mark.mode !== "outline" && regionPaths(mark).map(({region,d}) => <path key={region} d={d} fill={gradients.length ? `url(#${id}-${region})` : "var(--zw-mark-stroke)"} />)}
    <path d={MARK_OUTLINE} fill="none" stroke="var(--zw-mark-stroke)" strokeWidth={64} strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
