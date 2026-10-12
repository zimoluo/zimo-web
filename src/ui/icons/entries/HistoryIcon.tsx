import type { IconProps } from "../index";

export default function HistoryIcon({ className = "", size = 20, strokeWidth = 1.4, redo = false }: IconProps & { readonly redo?: boolean }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><g transform={redo ? "translate(24 0) scale(-1 1)" : undefined}><path d="m9 4-5 5 5 5M4 9h9a7 7 0 1 1-6.2 10.2" /></g></svg>;
}
