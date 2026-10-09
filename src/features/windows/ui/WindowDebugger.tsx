"use client";

import { useWindows } from "../store";
import { useWindowIdentity } from "../window-identity";
export default function WindowDebugger() {
  const { id } = useWindowIdentity();
  const instance = useWindows((state) => state.instances[id]);
  return <div className="p-4"><h2>Window state</h2><pre className="overflow-auto text-sm">{JSON.stringify(instance, null, 2)}</pre><p>Geometry updates commit when a gesture ends.</p></div>;
}
