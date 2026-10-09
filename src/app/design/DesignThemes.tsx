"use client";
import { getTheme, listedThemeIds, ThemeMark, useTheme, type ThemeSourceController } from "@/src/features/theme";
function ThemeTile({ id }: { readonly id: typeof listedThemeIds[number] }) {
  const source = getTheme(id);
  const controller: ThemeSourceController = { read: () => ({ source, scheme: source.schemes.kind === "single" ? source.schemes.scheme : "light" }), subscribe: () => () => {} };
  return <button type="button" className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl p-2 hover:bg-fill" onClick={() => useTheme.getState().selectBuiltIn(id)}><ThemeMark controller={controller} className="size-12" title={source.name} /><span className="text-xs">{source.name}</span></button>;
}
export function DesignThemes() { return <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">{listedThemeIds.map((id) => <ThemeTile key={id} id={id} />)}</div>; }
