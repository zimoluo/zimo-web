"use client";

import { useWindows } from "../store";
import { useWindowIdentity } from "../window-identity";
export default function WindowDebugger() {
  const { id } = useWindowIdentity();
  const instance = useWindows((state) => state.instances[id]);
  return <div className="grid gap-4 p-6"><h2 className="text-lg font-bold">Window state</h2><pre className="surface-sunken overflow-auto rounded-lg p-4 text-xs leading-relaxed">{JSON.stringify(instance, null, 2)}</pre><p className="text-sm text-text-muted">Geometry updates commit when a gesture ends.</p></div>;
}
