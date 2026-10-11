"use client";

import { useRef, useState, type InputHTMLAttributes } from "react";

type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "min" | "max"> & {
  readonly value: number;
  readonly change: (value: number) => void;
  readonly min: number;
  readonly max: number;
};

export function NumberInput({ value, change, min, max, onFocus, onBlur, onKeyDown, ...props }: NumberInputProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const initial = useRef(value);
  const touched = useRef(false);
  const canceled = useRef(false);
  return <input {...props} type="number" min={min} max={max} value={editing ?? Math.round(value * 1000) / 1000} onFocus={(event) => {
    initial.current = value; touched.current = false; canceled.current = false;
    setEditing(event.currentTarget.value); onFocus?.(event);
  }} onChange={(event) => {
    const text = event.currentTarget.value;
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
      event.preventDefault(); canceled.current = true; change(initial.current); setEditing(null); event.currentTarget.blur();
    }
  }} />;
}
