"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";

type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "min" | "max"> & {
  readonly value: number;
  readonly change: (value: number) => void;
  readonly min: number;
  readonly max: number;
  readonly subscribeReset?: ((reset: () => void) => () => void) | undefined;
};

export function NumberInput({ value, change, min, max, onFocus, onBlur, onKeyDown, subscribeReset, ...props }: NumberInputProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const initial = useRef(value);
  const touched = useRef(false);
  const canceled = useRef(false);
  useEffect(() => subscribeReset?.(() => { touched.current = false; canceled.current = false; if (editing !== null) setEditing(null); }), [subscribeReset, editing]);
  return <input {...props} type="number" min={min} max={max} value={editing ?? Math.round(value * 1000) / 1000} onFocus={(event) => {
    initial.current = value; touched.current = false; canceled.current = false;
    setEditing(event.currentTarget.value); onFocus?.(event);
  }} onChange={(event) => {
    const text = event.currentTarget.value;
    if (editing === null) { initial.current = value; canceled.current = false; }
    touched.current = true; setEditing(text);
    const next = event.currentTarget.valueAsNumber;
    if (text !== "" && Number.isFinite(next) && next >= min && next <= max) change(next);
  }} onBlur={(event) => {
    const next = event.currentTarget.valueAsNumber;
    if (!canceled.current && touched.current && Number.isFinite(next)) change(Math.max(min, Math.min(max, next)));
    setEditing(null); onBlur?.(event);
  }} onKeyDown={(event) => {
    onKeyDown?.(event);
    if (!event.defaultPrevented && event.key === "Enter") event.currentTarget.blur();
    if (!event.defaultPrevented && event.key === "Escape") {
      event.preventDefault(); canceled.current = true; if (touched.current) change(initial.current); setEditing(null); event.currentTarget.blur();
    }
  }} />;
}
