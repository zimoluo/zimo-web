"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { subscribeEditBoundary } from "../edit-boundary";

const rangeKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);
export function useStudioRange({ owner, begin, end }: { readonly owner?: symbol | undefined; readonly begin: () => void; readonly end: () => void }) {
  const [privateOwner] = useState(() => Symbol("Studio range"));
  const pointer = useRef<{ id: number; blocked: boolean } | null>(null);
  const held = useRef(new Set<string>()), blocked = useRef(new Set<string>());
  useEffect(() => subscribeEditBoundary(owner ?? privateOwner, () => {
    if (pointer.current) pointer.current.blocked = true;
    for (const key of held.current) blocked.current.add(key);
    end();
  }), [owner, privateOwner, end]);
  const finishPointer = (event: PointerEvent<HTMLElement>) => {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    if (!held.current.size) end();
  };
  return {
    acceptsChange: () => !pointer.current?.blocked && !blocked.current.size,
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0 || !event.isPrimary) return;
      begin(); pointer.current = { id: event.pointerId, blocked: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerUp: finishPointer, onPointerCancel: finishPointer, onLostPointerCapture: finishPointer,
    onFocus: () => begin(),
    onBlur: () => { if (pointer.current) pointer.current.blocked = true; held.current.clear(); blocked.current.clear(); end(); },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (!rangeKeys.has(event.key)) return;
      if (blocked.current.has(event.key) && event.repeat) { event.preventDefault(); return; }
      if (!event.repeat) blocked.current.delete(event.key);
      begin(); held.current.add(event.key);
    },
    onKeyUp: (event: KeyboardEvent<HTMLElement>) => {
      held.current.delete(event.key); blocked.current.delete(event.key);
      if (!held.current.size && !pointer.current) end();
    },
  };
}
