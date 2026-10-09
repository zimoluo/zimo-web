"use client";

import { useEffect, useRef, useState } from "react";
import { useDragGesture } from "../../../../lib/gesture/use-drag-gesture";
import { formatHex, formatOklch, linearToGamma, maxChroma, oklchToLinearSrgb, parseColorLiteral, type ColorLiteral, type Oklch } from "../../color";
import { resolve, resolveColorRef, toRampSpec } from "../../model/resolve";
import { effectiveScheme } from "../../runtime/active-source";
import { ROLE_NAMES, type ColorRef } from "../../model/types";
import { useStudio } from "../store";
import { useColorPicker, type ColorTarget } from "./store";

const colorOf = (ref: ColorRef): Oklch => {
  const state = useStudio.getState();
  const theme = resolve(state.draft, effectiveScheme(state.draft, state.selection.scheme));
  return resolveColorRef(ref, toRampSpec(state.draft.ramp), theme.roles);
};
const literal = (color: Oklch): ColorRef => ({ kind: "literal", value: formatOklch(color) as unknown as ColorLiteral });
const hueRing = `conic-gradient(from 90deg, ${Array.from({ length: 73 }, (_, index) => { const h = index * 5; return `${formatOklch({ l: .65, c: maxChroma(.65, h, "srgb"), h })} ${h}deg`; }).join(", ")})`;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

function PickerBody({ target }: { readonly target: ColorTarget }) {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [value, setValue] = useState(target.value);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const color = colorOf(value);
  const latest = useRef(color);
  useEffect(() => { latest.current = color; }, [color]);
  const change = (next: ColorRef) => { target.onChange(next); setValue(next); setError(""); };
  useEffect(() => useStudio.subscribe((state) => state.draft, () => setValue(target.value())), [target]);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const bounds = target.anchor.getBoundingClientRect();
    element.style.left = `${Math.max(8, Math.min(window.innerWidth - 312, bounds.left))}px`;
    element.style.top = `${Math.max(8, Math.min(window.innerHeight - 540, bounds.bottom + 8))}px`;
    element.showPopover();
    const toggle = (event: Event) => { if ((event as ToggleEvent).newState === "closed") useColorPicker.getState().close(); };
    element.addEventListener("toggle", toggle);
    const resize = () => useColorPicker.getState().close();
    window.addEventListener("resize", resize);
    return () => { element.removeEventListener("toggle", toggle); window.removeEventListener("resize", resize); element.hidePopover(); };
  }, [target]);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    const pixels = context.createImageData(80, 80);
    for (let y = 0; y < 80; y++) {
      const l = 1 - y / 79; const maximum = maxChroma(l, color.h, "srgb");
      for (let x = 0; x < 80; x++) {
        const rgb = oklchToLinearSrgb({ l, c: maximum * x / 79, h: color.h });
        const at = (y * 80 + x) * 4;
        pixels.data[at] = Math.round(clamp(linearToGamma(rgb.r)) * 255);
        pixels.data[at + 1] = Math.round(clamp(linearToGamma(rgb.g)) * 255);
        pixels.data[at + 2] = Math.round(clamp(linearToGamma(rgb.b)) * 255);
        pixels.data[at + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
  }, [color.h]);
  const pad = useDragGesture({
    onStart: (pointer, element) => { const rect = element.getBoundingClientRect(); const l = clamp(1 - (pointer.clientY - rect.top) / rect.height); change(literal({ l, c: maxChroma(l, latest.current.h, "srgb") * clamp((pointer.clientX - rect.left) / rect.width), h: latest.current.h })); return rect; },
    onMove: (pointer, rect) => { const l = clamp(1 - (pointer.clientY - rect.top) / rect.height); change(literal({ l, c: maxChroma(l, latest.current.h, "srgb") * clamp((pointer.clientX - rect.left) / rect.width), h: latest.current.h })); },
    onEnd: () => {},
  });
  const wheel = useDragGesture({
    onStart: (pointer, element) => { const rect = element.getBoundingClientRect(); const h = (Math.atan2(pointer.clientY - rect.top - rect.height / 2, pointer.clientX - rect.left - rect.width / 2) * 180 / Math.PI + 360) % 360; const color = latest.current; change(literal({ ...color, h, c: maxChroma(color.l, h, "srgb") * Math.min(1, color.c / Math.max(.0001, maxChroma(color.l, color.h, "srgb"))) })); return rect; },
    onMove: (pointer, rect) => { const h = (Math.atan2(pointer.clientY - rect.top - rect.height / 2, pointer.clientX - rect.left - rect.width / 2) * 180 / Math.PI + 360) % 360; const color = latest.current; change(literal({ ...color, h, c: maxChroma(color.l, h, "srgb") * Math.min(1, color.c / Math.max(.0001, maxChroma(color.l, color.h, "srgb"))) })); }, onEnd: () => {},
  });
  const parse = () => {
    try { change(literal(parseColorLiteral(input))); } catch { setError("Enter a hexadecimal or OKLCH color."); }
  };
  return <div ref={ref} popover="auto" role="dialog" aria-label={`Color: ${target.label}`} className="fixed m-0 w-[304px] max-h-[calc(100dvh-16px)] overflow-auto rounded-2xl border border-line bg-panel p-4 text-text shadow-xl">
    <div className="mb-3 flex items-center justify-between"><strong>{target.label}</strong><button type="button" aria-label="Close color picker" onClick={() => useColorPicker.getState().close()} className="size-11">×</button></div>
    {target.allow.includes("oklch") && <><div aria-hidden="true" onPointerDown={wheel.onPointerDown} className="mx-auto mb-3 size-28 rounded-full p-4" style={{ ...wheel.style, background: hueRing }}><div className="size-full rounded-full bg-panel" /></div>
      <div className="relative mb-3" style={pad.style} onPointerDown={pad.onPointerDown}>
        <canvas ref={canvas} width={80} height={80} className="h-44 w-full rounded-lg" aria-label="Lightness and relative chroma" />
        <span className="pointer-events-none absolute size-3 rounded-full border-2 border-white outline outline-1 outline-black" style={{ left: `${clamp(color.c / Math.max(0.0001, maxChroma(color.l, color.h, "srgb"))) * 100}%`, top: `${(1 - color.l) * 100}%`, transform: "translate(-50%, -50%)" }} />
      </div>
      <label className="block">Hue <input type="range" min={0} max={360} step={1} value={color.h} className="w-full" onChange={(event) => { const h = Number(event.target.value); const relative = color.c / Math.max(0.0001, maxChroma(color.l, color.h, "srgb")); change(literal({ ...color, h, c: maxChroma(color.l, h, "srgb") * relative })); }} /></label>
      <div className="grid grid-cols-3 gap-2">{(["l", "c", "h"] as const).map((key) => <label key={key}>{key.toUpperCase()}<input aria-label={key === "l" ? "Lightness" : key === "c" ? "Chroma" : "Hue value"} type="number" min={0} max={key === "h" ? 360 : key === "l" ? 1 : 0.5} step={key === "h" ? 1 : 0.001} value={Number(color[key].toFixed(3))} onChange={(event) => { const value = Number(event.target.value); if (!Number.isFinite(value)) return; const next = { ...color, [key]: Math.max(0, Math.min(key === "h" ? 360 : key === "l" ? 1 : .5, value)) }; next.c = Math.max(0, Math.min(next.c, maxChroma(next.l, next.h, "srgb"))); change(literal(next)); }} className="min-w-0 w-full rounded border border-line bg-fill p-2" /></label>)}</div>
    </>}
    {target.allow.includes("tone") && <label className="mt-3 block">Tone {value.kind === "tone" ? value.at.toFixed(2) : ""}<input type="range" min={0} max={1} step={0.001} value={value.kind === "tone" ? value.at : 0.5} className="w-full" onChange={(event) => change({ kind: "tone", at: Number(event.target.value) })} /></label>}
    {target.allow.includes("role") && <label className="mt-3 block">Role <select className="w-full rounded border border-line bg-fill p-2" value={value.kind === "role" ? value.role : ""} onChange={(event) => { const role = ROLE_NAMES.find((name) => name === event.target.value); if (role) change({ kind: "role", role }); }}><option value="" disabled>Choose a role</option>{ROLE_NAMES.map((role) => <option key={role}>{role}</option>)}</select></label>}
    {target.allow.includes("hex") && <div className="mt-3 flex gap-2"><input aria-label="Paste a color" placeholder={formatHex(color)} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") parse(); }} className="min-w-0 grow rounded border border-line bg-fill px-2" /><button type="button" onClick={parse} className="min-h-11">Use</button></div>}
    {target.allow.includes("eyedropper") && <button type="button" className="mt-2 min-h-11" hidden={typeof window === "undefined" || !("EyeDropper" in window)} onClick={async () => {
      const browser = window as unknown as { EyeDropper?: new () => { open(): Promise<{ sRGBHex: string }> } };
      if (!browser.EyeDropper) return;
      try { change(literal(parseColorLiteral((await new browser.EyeDropper().open()).sRGBHex))); } catch { return; }
    }}>Pick from screen</button>}
    <p className="mt-2 text-sm" aria-live="polite">{error || formatOklch(color)}</p>
  </div>;
}
export function ColorPicker() { const target = useColorPicker((state) => state.target); return target ? <PickerBody key={target.label} target={target} /> : null; }
