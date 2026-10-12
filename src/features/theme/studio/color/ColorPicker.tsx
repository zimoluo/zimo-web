"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useStudioRange } from "../ui/use-studio-range";
import { useStudioDrag } from "../ui/use-studio-drag";
import { formatHex, formatOklch, linearToGamma, maxChroma, oklchToLinearSrgb, parseColorLiteral, type ColorLiteral, type Oklch } from "../../color";
import { resolve, resolveColorRef, toRampSpec } from "../../model/resolve";
import { previewScheme } from "../../runtime/active-source";
import { ROLE_NAMES, type ColorRef } from "../../model/types";
import { useStudio } from "../store";
import { useColorPicker, type ColorTarget } from "./store";
import { SurfaceRim } from "../../../../ui/SurfaceRim";
import { NumberInput } from "../../../../ui/NumberInput";
import CrossIcon from "../../../../ui/icons/CrossIcon";
import controls from "../../../../ui/controls.module.css";
import styles from "../ui/studio.module.css";

const colorOf = (ref: ColorRef): Oklch => {
  const state = useStudio.getState();
  const theme = resolve(state.draft, previewScheme(state.draft, state.selection.scheme));
  return resolveColorRef(ref, toRampSpec(state.draft.ramp), theme.roles);
};
const literal = (color: Oklch): ColorRef => ({ kind: "literal", value: formatOklch(color) as unknown as ColorLiteral });
const hueRing = `linear-gradient(to right, ${Array.from({ length: 73 }, (_, index) => { const h = index * 5; return `${formatOklch({ l: .65, c: maxChroma(.65, h, "srgb"), h })} ${h / 3.6}%`; }).join(", ")})`;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

function PickerBody({ target }: { readonly target: ColorTarget }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const canvas = useRef<HTMLCanvasElement>(null);
  useStudio(useShallow(state => [JSON.stringify(target.value()), state.draft.ramp, state.draft.schemes, state.selection.scheme]));
  const value = target.value();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const begin = useCallback(() => target.onBegin?.(), [target]);
  const end = useCallback(() => target.onCommit?.(), [target]);
  const { acceptsChange: acceptsHue, ...hueEvents } = useStudioRange({ owner: target.owner, begin, end });
  const { acceptsChange: acceptsTone, ...toneEvents } = useStudioRange({ owner: target.owner, begin, end });
  const color = colorOf(value);
  const latest = useRef(color);
  useEffect(() => { latest.current = color; }, [color]);
  const change = (next: ColorRef) => { target.onChange(next); setError(""); };
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const position = () => {
      if (!target.anchor.isConnected) { useColorPicker.getState().close(); return; }
      const anchor = target.anchor.getBoundingClientRect();
      const bounds = element.getBoundingClientRect();
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0, top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth, height = viewport?.height ?? window.innerHeight;
      const below = anchor.bottom + 8;
      const preferred = below + bounds.height <= top + height - 8 ? below : anchor.top - bounds.height - 8;
      element.style.left = `${Math.max(left + 8, Math.min(left + width - bounds.width - 8, anchor.left))}px`;
      element.style.top = `${Math.max(top + 8, Math.min(top + height - bounds.height - 8, preferred))}px`;
      element.style.maxHeight = `${height - 16}px`;
    };
    element.showPopover();
    position();
    element.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    const toggle = (event: Event) => { if ((event as ToggleEvent).newState === "closed") useColorPicker.getState().close(); };
    element.addEventListener("toggle", toggle);
    const observer = new ResizeObserver(position);
    observer.observe(element);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    window.visualViewport?.addEventListener("resize", position);
    return () => {
      target.onCommit?.();
      const restore = element.contains(document.activeElement) || document.activeElement === document.body;
      element.removeEventListener("toggle", toggle); observer.disconnect();
      window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true);
      window.visualViewport?.removeEventListener("resize", position); element.hidePopover();
      if (restore && target.anchor.isConnected) target.anchor.focus({ preventScroll: true });
    };
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
  const pad = useStudioDrag({
    onStart: (pointer, element) => { element.focus({ preventScroll: true }); target.onBegin?.(); const rect = element.getBoundingClientRect(); const l = clamp(1 - (pointer.clientY - rect.top) / rect.height); change(literal({ l, c: maxChroma(l, latest.current.h, "srgb") * clamp((pointer.clientX - rect.left) / rect.width), h: latest.current.h })); return rect; },
    onMove: (pointer, rect) => { const l = clamp(1 - (pointer.clientY - rect.top) / rect.height); change(literal({ l, c: maxChroma(l, latest.current.h, "srgb") * clamp((pointer.clientX - rect.left) / rect.width), h: latest.current.h })); },
    onEnd: () => target.onCommit?.(),
    onCancel: () => target.onCommit?.(),
  }, target.owner);
  const parse = () => {
    try { change(literal(parseColorLiteral(input))); } catch { setError("Enter a hexadecimal or OKLCH color."); }
  };
  return <div ref={ref} id={id} data-studio-color-picker="" popover="auto" role="dialog" aria-label={`Color: ${target.label}`} className={`${styles.studio} ${styles.picker} ${styles.panel} surface-edge`}>
    <div className={styles.pickerHeading}><strong>{target.label}</strong><button type="button" aria-label="Close color picker" onClick={() => useColorPicker.getState().close()} className="size-11"><CrossIcon className="mx-auto size-5" /></button></div>
    <div className={styles.pickerContents}>
    {target.allow.includes("oklch") && <>
      <div className="relative" style={pad.style} tabIndex={-1} role="group" aria-label="Color plane" onPointerDown={pad.onPointerDown}>
        <canvas ref={canvas} width={80} height={80} className="h-36 w-full rounded-lg" aria-label="Lightness and relative chroma" />
        <span className="pointer-events-none absolute size-3 rounded-full border-2 border-white outline outline-1 outline-black" style={{ left: `${clamp(color.c / Math.max(0.0001, maxChroma(color.l, color.h, "srgb"))) * 100}%`, top: `${(1 - color.l) * 100}%`, transform: "translate(-50%, -50%)" }} />
      </div>
      <label className="block">Hue <input type="range" min={0} max={360} step={1} value={color.h} {...hueEvents} className={`${controls.range} ${styles.hueRange}`} style={{ backgroundImage: hueRing }} onChange={(event) => { if (!acceptsHue()) return; begin(); const h = Number(event.target.value); const relative = color.c / Math.max(0.0001, maxChroma(color.l, color.h, "srgb")); change(literal({ ...color, h, c: maxChroma(color.l, h, "srgb") * relative })); }} /></label>
      <div className="grid grid-cols-3 gap-2">{(["l", "c", "h"] as const).map((key) => <label key={key}>{key.toUpperCase()}<NumberInput aria-label={key === "l" ? "Lightness" : key === "c" ? "Chroma" : "Hue value"} min={0} max={key === "h" ? 360 : key === "l" ? 1 : 0.5} step={key === "h" ? 1 : 0.001} value={color[key]} subscribeReset={target.subscribeReset} onFocus={() => target.onBegin?.()} onBlur={() => target.onCommit?.()} change={(value) => {
        begin(); const next = { ...color, [key]: value };
        next.c = Math.max(0, Math.min(next.c, maxChroma(next.l, next.h, "srgb")));
        change(literal(next));
      }} className="min-w-0 w-full rounded border border-line bg-fill p-2" /></label>)}</div>
    </>}
    {target.allow.includes("tone") && value.kind !== "tone" && <button type="button" className="min-h-11" onClick={() => change({ kind: "tone", at: .5 })}>Use ramp tone</button>}
    {target.allow.includes("tone") && value.kind === "tone" && <label className="block">Tone {value.kind === "tone" ? value.at.toFixed(2) : ""}<input type="range" min={0} max={1} step={0.001} value={value.kind === "tone" ? value.at : 0.5} className={controls.range} {...toneEvents} onChange={(event) => { if (acceptsTone()) { begin(); change({ kind: "tone", at: Number(event.target.value) }); } }} /></label>}
    {target.allow.includes("role") && <label className="block">Role <select className="w-full rounded border border-line bg-fill p-2" value={value.kind === "role" ? value.role : ""} onChange={(event) => { const role = ROLE_NAMES.find((name) => name === event.target.value); if (role) change({ kind: "role", role }); }}><option value="" disabled>Choose a role</option>{ROLE_NAMES.map((role) => <option key={role}>{role}</option>)}</select></label>}
    {target.allow.includes("hex") && <div className="flex gap-2"><input aria-label="Paste a color" placeholder={formatHex(color)} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") parse(); }} className="min-w-0 grow rounded border border-line bg-fill px-2" /><button type="button" onClick={parse} className="min-h-11">Use</button></div>}
    {target.allow.includes("eyedropper") && <button type="button" className="min-h-11" hidden={typeof window === "undefined" || !("EyeDropper" in window)} onClick={async () => {
      const browser = window as unknown as { EyeDropper?: new () => { open(): Promise<{ sRGBHex: string }> } };
      if (!browser.EyeDropper) return;
      try { change(literal(parseColorLiteral((await new browser.EyeDropper().open()).sRGBHex))); } catch { return; }
    }}>Pick from screen</button>}
    <p className="text-sm" aria-live="polite">{error || formatOklch(color)}</p>
    </div><SurfaceRim />
  </div>;
}
export function ColorPicker() { const { target, revision } = useColorPicker(); return target ? <PickerBody key={revision} target={target} /> : null; }
