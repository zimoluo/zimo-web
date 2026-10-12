import { useColorPicker } from "./color/store";
import { useStudio } from "./store";

const nativeTextTypes = new Set(["text", "search", "email", "url", "password", "tel", "number"]);
export function studioHistoryShortcut(event: KeyboardEvent, root: HTMLElement): void {
  if (event.defaultPrevented || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const popup = target.closest("[data-studio-color-picker]");
  const anchor = useColorPicker.getState().target?.anchor;
  if (!root.contains(target) && !(popup && anchor && root.contains(anchor))) return;
  if (target.isContentEditable || target.closest("textarea, [contenteditable=true]") || target instanceof HTMLInputElement && nativeTextTypes.has(target.type)) return;
  event.preventDefault();
  if (event.shiftKey) useStudio.getState().redo(); else useStudio.getState().undo();
}
