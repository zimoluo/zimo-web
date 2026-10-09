"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode, RefObject } from "react";
import type { WindowId } from "./model";
import { frontmost } from "./model";
import { useWindows } from "./store";

export type WindowIdentity = { readonly id: WindowId; readonly contentRef: RefObject<HTMLDivElement | null> };
const identityContext = createContext<WindowIdentity | null>(null);

export function WindowIdentityProvider({ identity, children }: { readonly identity: WindowIdentity; readonly children: ReactNode }) {
  return <identityContext.Provider value={identity}>{children}</identityContext.Provider>;
}
export function useWindowIdentity(): WindowIdentity {
  const identity = useContext(identityContext);
  if (identity === null) throw new Error("Window content must be rendered inside a window");
  return identity;
}
export function useWindowInstance() {
  const { id, contentRef } = useWindowIdentity();
  const active = useWindows((state) => frontmost(state) === id && !state.minimized);
  const instance = useWindows((state) => state.instances[id]);
  const actions = useMemo(() => ({
    updateProps: (patch: Readonly<Record<string, unknown>>) => {
      const state = useWindows.getState();
      const current = state.instances[id];
      if (current !== undefined) state.setProps(id, { ...current.props, ...patch });
    },
    close: () => useWindows.getState().close(id),
    focus: () => useWindows.getState().focus(id),
  }), [id]);
  return { id, active, contentRef, instance, ...actions };
}
