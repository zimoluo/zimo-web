"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { OverlayId } from "./model";
import { useOverlays } from "./store";
const context = createContext<OverlayId | null>(null);
export function OverlayIdentityProvider({ id, children }: { readonly id: OverlayId; readonly children: ReactNode }) { return <context.Provider value={id}>{children}</context.Provider>; }
export function useOverlayIdentity() {
  const id = useContext(context);
  if (id === null) throw new Error("Overlay content must be rendered inside a dialog");
  return { id, dismiss: () => useOverlays.getState().dismiss(id) };
}
