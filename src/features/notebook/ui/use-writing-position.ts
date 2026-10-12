"use client";
import { useCallback, useLayoutEffect, useRef } from "react";
import { workspaceStore } from "../../workspace";

type WritingPosition = { readonly from: number; readonly to: number; readonly direction: "forward" | "backward" | "none"; readonly top: number; readonly left: number };

export function useWritingPosition(activeId: string | null, preview: boolean) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const positions = useRef(new Map<string, WritingPosition>());
  const focusNext = useRef(false);
  const remember = useCallback(() => {
    const element = textarea.current, id = element?.dataset.notebookPage;
    if (!element || !id) return;
    positions.current.set(id, { from: element.selectionStart, to: element.selectionEnd, direction: element.selectionDirection, top: element.scrollTop, left: element.scrollLeft });
  }, [textarea]);
  useLayoutEffect(() => workspaceStore.subscribe(state => state.notebook.activeId, () => {
    remember();
    const surviving = new Set(workspaceStore.getState().notebook.pages.map(page => page.id));
    for (const id of positions.current.keys()) if (!surviving.has(id)) positions.current.delete(id);
  }), [remember]);
  useLayoutEffect(() => {
    const element = textarea.current;
    if (!element || activeId === null || preview) return;
    const position = positions.current.get(activeId);
    element.setSelectionRange(position?.from ?? 0, position?.to ?? 0, position?.direction ?? "none");
    if (focusNext.current) { element.focus({ preventScroll: true }); focusNext.current = false; }
    element.scrollTop = position?.top ?? 0;
    element.scrollLeft = position?.left ?? 0;
  }, [textarea, activeId, preview]);
  const attach = useCallback((element: HTMLTextAreaElement | null) => {
    if (element === null) remember();
    textarea.current = element;
  }, [remember]);
  return {
    attach,
    element: () => textarea.current,
    remember,
    focus: () => { focusNext.current = true; },
    copy: (from: string, to: string) => { const position = positions.current.get(from); if (position) positions.current.set(to, position); },
  };
}
