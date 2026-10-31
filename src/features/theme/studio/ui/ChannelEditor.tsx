"use client";

import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import type { Draft } from "immer";
import { channelizeTheme, channelUsePaths } from "../../model/channels";
import { formatOklch, sampleRamp } from "../../color";
import { literal } from "../../model/literal";
import { resolve, resolveChannelPaint, toRampSpec } from "../../model/resolve";
import { previewScheme } from "../../runtime/active-source";
import type { ChannelPaint, ColorChannel, RampSource } from "../../model/types";
import { useStudio } from "../store";
import { useColorPicker } from "../color/store";
import { notifyError } from "../../../notifications";
import { ColorSwatch } from "../color/ColorSwatch";
import { NumberInput } from "../../../../ui/NumberInput";
import { Toggle } from "../../../../ui/Toggle";
import { useStudioGesture } from "./use-studio-gesture";
import { useStudioRange } from "./use-studio-range";
import controls from "../../../../ui/controls.module.css";
import styles from "./studio.module.css";

function ChannelNumber({ label, value, min, max, step = .001, change }: { readonly label: string; readonly value: number; readonly min: number; readonly max: number; readonly step?: number; readonly change: (value: number) => void }) {
  const gesture = useStudioGesture(), { acceptsChange, ...events } = useStudioRange(gesture);
  return <label className={styles.field}>{label}<span className={styles.numbers}><input aria-label={`${label} slider`} type="range" className={controls.range} min={min} max={max} step={step} value={value} {...events} onChange={(event) => { if (acceptsChange()) { gesture.begin(); change(Number(event.target.value)); } }} /><NumberInput aria-label={label} value={value} min={min} max={max} step={step} subscribeReset={gesture.subscribeReset} onFocus={gesture.begin} onBlur={gesture.end} change={(value) => { gesture.begin(); change(value); }} /></span></label>;
}

const copy = <T,>(value: T): Draft<T> => JSON.parse(JSON.stringify(value)) as Draft<T>;
const usesLabel = (path: string): string => path.startsWith("schemes") ? "Interface colors" : path.includes("backdrop") ? "Animated backdrop" : path.includes("mark") ? "Identity mark" : path.includes("surfaces") ? `${path.split("surfaces.")[1]?.split(".")[0] ?? "Material"} surface` : "Color";

export function ChannelEditor() {
  useStudio(useShallow((state) => [state.draft.schemes, state.draft.surfaces, state.draft.backdrop, state.draft.mark, state.draft.appearance]));
  const ramp = useStudio((state) => state.draft.ramp);
  const channels = useStudio((state) => state.draft.channels), scheme = useStudio((state) => state.selection.scheme);
  const [selected, select] = useState("");
  const id = Object.hasOwn(channels ?? {}, selected) ? selected : Object.keys(channels ?? {})[0];
  const channel = id === undefined ? undefined : channels?.[id];
  const overridden = channel?.appearance?.[scheme] !== undefined;
  const paint = channel?.appearance?.[scheme] ?? channel?.source;
  const gesture = useStudioGesture();
  const edit = (recipe: (channel: Draft<ColorChannel>) => void) => {
    if (id === undefined) return;
    useStudio.getState().edit((draft) => { const channel = draft.channels?.[id]; if (channel) recipe(channel); });
  };
  const setPaint = (paint: ChannelPaint) => edit((channel) => {
    const selected = useStudio.getState().selection.scheme;
    if (channel.appearance?.[selected] !== undefined) channel.appearance[selected] = copy(paint);
    else channel.source = copy(paint);
  });
  const updateRamp = (recipe: (ramp: Draft<RampSource>) => void) => edit((channel) => {
    const paint = channel.appearance?.[scheme] ?? channel.source;
    if (paint.kind === "ramp") recipe(paint.ramp);
  });
  const usage = id === undefined ? [] : channelUsePaths(useStudio.getState().draft, id);
  return <section data-color-channels="" className={`${styles.section} surface-nested surface-outline`}>
    <h2>Color channels</h2><p className={styles.hint}>Shared colors for the interface, materials, mark, and motion. Each channel owns its appearance.</p>
    {channel === undefined || paint === undefined ? <button type="button" onClick={() => { try { useStudio.getState().edit((draft) => channelizeTheme(draft)); } catch (error) { notifyError(error instanceof Error ? error.message : "Unable to organize theme colors"); } }}>Organize existing colors</button> : <>
      <label className={styles.field}>Channel<select aria-label="Edit color channel" value={id} onChange={(event) => { useColorPicker.getState().close(); select(event.target.value); }}>{Object.entries(channels ?? {}).map(([key, channel]) => <option key={key} value={key}>{channel.name}</option>)}</select></label>
      <label className={styles.field}>Channel name<input aria-label="Channel name" value={channel.name} onFocus={gesture.begin} onBlur={gesture.end} onChange={(event) => { gesture.begin(); edit((channel) => { channel.name = event.target.value; }); }} /></label>
      <div className={styles.channelRamp} role="img" aria-label={`${channel.name} colors`} style={{ backgroundImage: `linear-gradient(to right, ${Array.from({ length: paint.kind === "literal" ? 2 : 21 }, (_, index) => formatOklch(resolveChannelPaint(paint, toRampSpec(ramp), paint.kind === "literal" ? undefined : index / 20))).join(", ")})` }} />
      <p className={styles.hint}>{usage.length === 0 ? "This channel has no connections yet." : `Used by ${[...new Set(usage.map(usesLabel))].join(", ")}.`}</p>
      {useStudio.getState().draft.schemes.kind === "dual" && <label className={styles.check}><Toggle checked={overridden} change={(value) => edit((channel) => { if (value) { channel.appearance ??= {}; channel.appearance[scheme] = copy(channel.source); } else if (channel.appearance) delete channel.appearance[scheme]; })} />Separate {scheme} treatment</label>}
      <label className={styles.field}>Color source<select aria-label="Channel color source" value={paint.kind} onChange={(event) => {
        if (event.target.value === "literal") { const state = useStudio.getState(); setPaint({ kind: "literal", value: literal(formatOklch(resolve(state.draft, previewScheme(state.draft, scheme)).channel(id!))) }); }
        else if (event.target.value === "tone") setPaint({ kind: "tone", at: paint.kind === "literal" ? .5 : paint.at });
        else if (event.target.value === "ramp") setPaint({ kind: "ramp", at: paint.kind === "literal" ? .5 : paint.at, ramp: copy(useStudio.getState().draft.ramp) });
      }}><option value="tone">Main ramp</option><option value="ramp">Independent ramp</option><option value="literal">Fixed color</option></select></label>
      {paint.kind === "literal" && <p className={styles.hint}>All connected shades use this color. Their shade settings are kept.</p>}
      {paint.kind === "literal" ? <div className={styles.row}>Channel color<ColorSwatch key={id} label="Channel fixed color" allow={["oklch", "hex", "eyedropper"]} value={() => {
        const value = useStudio.getState().draft.channels?.[id!];
        const paint = value?.appearance?.[useStudio.getState().selection.scheme] ?? value?.source;
        return paint?.kind === "literal" ? paint : { kind: "tone", at: .5 };
      }} onChange={(value) => { if (value.kind === "literal") setPaint(value); }} /></div> : <>
        <ChannelNumber label="Default shade" value={paint.at} min={0} max={1} change={(at) => setPaint({ ...paint, at })} />
        <label className={styles.check}><Toggle checked={paint.reverse === true} change={(reverse) => setPaint({ ...paint, reverse })} />Reverse shade direction</label>
        {paint.kind === "tone" && <details className={`${styles.advanced} zw-disclosure`}><summary>Family adjustments</summary><div className={styles.advancedBody}>
          <ChannelNumber label={paint.hue && "value" in paint.hue ? "Channel hue value" : "Channel hue offset"} value={paint.hue ? "delta" in paint.hue ? paint.hue.delta : paint.hue.value : 0} min={-360} max={360} step={1} change={(delta) => setPaint({ ...paint, hue: paint.hue && "value" in paint.hue ? { value: delta } : { delta } })} />
          <ChannelNumber label={paint.chroma && "value" in paint.chroma ? "Channel chroma value" : "Channel chroma offset"} value={paint.chroma ? "delta" in paint.chroma ? paint.chroma.delta : paint.chroma.value : 0} min={-1} max={1} change={(delta) => setPaint({ ...paint, chroma: paint.chroma && "value" in paint.chroma ? { value: Math.max(0, delta) } : { delta } })} />
        </div></details>}
        {paint.kind === "ramp" && <>
          <ChannelNumber label="Channel hue" value={paint.ramp.hue} min={0} max={360} step={1} change={(hue) => updateRamp((ramp) => { ramp.hue = hue; })} />
          <ChannelNumber label="Channel relative chroma" value={paint.ramp.chroma} min={0} max={1} change={(chroma) => updateRamp((ramp) => { ramp.chroma = chroma; })} />
          <details className={`${styles.advanced} zw-disclosure`}><summary>Channel curve and stops</summary><div className={styles.advancedBody}>
            <ChannelNumber label="Channel torsion" value={paint.ramp.torsion ?? 0} min={-360} max={360} step={1} change={(torsion) => updateRamp((ramp) => { ramp.torsion = torsion; })} />
            <ChannelNumber label="Channel light endpoint" value={paint.ramp.lightest ?? .985} min={(paint.ramp.darkest ?? .165) + .001} max={1} change={(lightest) => updateRamp((ramp) => { ramp.lightest = lightest; const stop = ramp.stops?.find((stop) => stop.at === 0 && !stop.literal); if (stop) stop.lightness = lightest; })} />
            <ChannelNumber label="Channel dark endpoint" value={paint.ramp.darkest ?? .165} min={0} max={(paint.ramp.lightest ?? .985) - .001} change={(darkest) => updateRamp((ramp) => { ramp.darkest = darkest; const stop = ramp.stops?.find((stop) => stop.at === 1 && !stop.literal); if (stop) stop.lightness = darkest; })} />
            <label className={styles.field}>Channel lightness curve<select aria-label="Channel lightness curve" value={paint.ramp.ease ?? "default"} onChange={(event) => updateRamp((ramp) => { ramp.ease = event.target.value as NonNullable<RampSource["ease"]>; })}>{["default", "linear", "soft", "contrast"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label className={styles.field}>Channel chroma envelope<select aria-label="Channel chroma envelope" value={paint.ramp.envelope ?? "flat"} onChange={(event) => updateRamp((ramp) => { ramp.envelope = event.target.value as NonNullable<RampSource["envelope"]>; })}>{["flat", "dusty", "vivid"].map((value) => <option key={value}>{value}</option>)}</select></label>
            {(paint.ramp.stops ?? []).map((stop, index) => <div key={index} className={styles.rampStop}>
              <ChannelNumber label={`Channel stop ${index + 1} position`} value={stop.at} min={index === 0 ? 0 : (paint.ramp.stops?.[index - 1]?.at ?? 0) + .001} max={paint.ramp.stops?.[index + 1] ? paint.ramp.stops[index + 1]!.at - .001 : 1} change={(at) => updateRamp((ramp) => { ramp.stops![index]!.at = at; })} />
              <ColorSwatch label={`Channel stop ${index + 1} color`} allow={["oklch", "hex", "eyedropper"]} value={() => { const state = useStudio.getState(), channel = state.draft.channels?.[id!], paint = channel?.appearance?.[state.selection.scheme] ?? channel?.source; return paint?.kind === "ramp" && paint.ramp.stops?.[index]?.literal ? { kind: "literal", value: paint.ramp.stops[index]!.literal! } : { kind: "literal", value: literal(formatOklch(paint?.kind === "ramp" ? sampleRamp(stop.at, toRampSpec(paint.ramp)) : resolve(state.draft, previewScheme(state.draft, state.selection.scheme)).channel(id!, stop.at))) }; }} onChange={(value) => { if (value.kind === "literal") updateRamp((ramp) => { ramp.stops![index]!.literal = value.value; }); }} />
              <button type="button" aria-label={`Remove channel stop ${index + 1}`} onClick={() => updateRamp((ramp) => { ramp.stops?.splice(index, 1); })}>Remove stop</button>
            </div>)}
            <button type="button" onClick={() => updateRamp((ramp) => { const positions = [0, ...(ramp.stops ?? []).map((stop) => stop.at), 1]; let at = .5, span = -1; for (let index = 1; index < positions.length; index++) { const gap = positions[index]! - positions[index - 1]!; if (gap > span) { span = gap; at = (positions[index]! + positions[index - 1]!) / 2; } } if (span > .002) { ramp.stops ??= []; ramp.stops.push({ at }); ramp.stops.sort((a, b) => a.at - b.at); } })}>Add channel stop</button>
          </div></details>
        </>}
      </>}
      <button type="button" disabled={usage.length > 0} onClick={() => useStudio.getState().edit((draft) => { if (draft.channels && id) delete draft.channels[id]; })}>Remove unused channel</button>
    </>}
    <button type="button" disabled={Object.keys(channels ?? {}).length >= 128} onClick={() => { let index = 1; while (Object.hasOwn(channels ?? {}, `color-${index}`)) index++; const id = `color-${index}`; useStudio.getState().edit((draft) => { draft.channels ??= {}; draft.channels[id] = { name: `Color ${index}`, source: { kind: "tone", at: .5 } }; }); select(id); }}>Add color channel</button>
  </section>;
}
