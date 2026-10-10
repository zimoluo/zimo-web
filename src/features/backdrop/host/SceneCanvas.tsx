"use client";

import { addAfterEffect, Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, View } from "@react-three/drei";
import { Component, memo, Suspense, useEffect, useId, useRef } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import type { ErrorInfo, ReactNode } from "react";
import type { WebGLRenderer } from "three";
import type { HostedScene } from "./BackdropStack";
import { SceneRuntimeContext } from "./SceneRuntimeContext";
import { sceneRenderers } from "./scene-renderers";
import { RuntimeFrame } from "./RuntimeFrame";
import { RendererLease } from "./renderer-lease";
import styles from "./backdrop.module.css";

type Host = {
  readonly node: HTMLElement;
  readonly poster: HTMLElement;
  scenes: readonly HostedScene[];
  readonly ready: Set<string>;
  invalidate?: (() => void) | undefined;
};
class DocumentRenderer {
  private readonly hosts = new Map<string, Host>();
  private root: Root | null = null;
  private outlet: HTMLDivElement | null = null;
  private gl: WebGLRenderer | null = null;
  readonly lease = new RendererLease({
    activate: (id) => this.activate(id),
    capture: (id) => this.hosts.get(id)?.invalidate?.(),
    frame: (id, image) => {
      const host = this.hosts.get(id);
      if (host !== undefined && image !== null) { host.poster.style.backgroundImage = `url("${image}")`; host.poster.dataset.frame = "captured"; }
    },
  });
  mount(id: string, node: HTMLElement, poster: HTMLElement, scenes: readonly HostedScene[], contained: boolean): void {
    this.hosts.set(id, { node, poster, scenes, ready: new Set() });
    this.lease.mount(id, contained);
  }
  update(id: string, scenes: readonly HostedScene[]): void {
    const host = this.hosts.get(id); if (host === undefined || host.scenes === scenes) return;
    host.scenes = scenes; for (const key of host.ready) if (!scenes.some((item) => item.key === key)) host.ready.delete(key);
    this.lease.refresh(id);
    if (this.lease.current === id) this.render(id);
  }
  remove(id: string): void {
    this.hosts.delete(id); this.lease.remove(id);
  }
  setRenderer(gl: WebGLRenderer): void { this.gl = gl; }
  ready(id: string, key: string, ready: boolean): void {
    const host = this.hosts.get(id); if (host === undefined) return;
    if (ready) host.ready.add(key); else host.ready.delete(key);
    if (ready) host.invalidate?.();
  }
  invalidator(id: string, invalidate: () => void): () => void {
    const host = this.hosts.get(id); if (host === undefined) return () => undefined;
    host.invalidate = invalidate;
    if (this.lease.wantsFrame(id)) invalidate();
    return () => { if (host.invalidate === invalidate) host.invalidate = undefined; };
  }
  capture(id: string, gl: WebGLRenderer, width: number, height: number): void {
    const host = this.hosts.get(id);
    if (host === undefined || !this.lease.wantsFrame(id) || host.ready.size !== host.scenes.length) return;
    if (Math.abs(width - host.node.clientWidth) > 1 || Math.abs(height - host.node.clientHeight) > 1) { host.invalidate?.(); return; }
    let image: string | null = null;
    try { image = gl.domElement.toDataURL("image/png"); } catch { image = null; }
    this.lease.painted(id, image);
  }
  failed(id: string): void { this.lease.painted(id, null); }
  private render(id: string): void {
    const host = this.hosts.get(id); if (host === undefined || this.root === null) return;
    this.root.render(<SharedRenderer id={id} scenes={host.scenes} />);
  }
  private activate(id: string | null): void {
    if (id === null) {
      this.outlet?.remove();
      queueMicrotask(() => {
        if (this.lease.size !== 0) return;
        this.gl?.forceContextLoss(); this.gl?.dispose(); this.gl = null;
        this.root?.unmount(); this.root = null; this.outlet = null;
      });
      return;
    }
    const host = this.hosts.get(id); if (host === undefined) return;
    if (this.outlet === null) { this.outlet = document.createElement("div"); this.outlet.className = styles.rendererOutlet ?? ""; this.root = createRoot(this.outlet); }
    for (const candidate of this.hosts.values()) candidate.node.dataset.liveRenderer = "false";
    host.node.dataset.liveRenderer = "true"; host.node.appendChild(this.outlet); this.render(id);
  }
}
const documentRenderer = new DocumentRenderer();

function SceneReady({ id, sceneKey }: { readonly id: string; readonly sceneKey: string }) {
  useEffect(() => { documentRenderer.ready(id, sceneKey, true); return () => documentRenderer.ready(id, sceneKey, false); }, [id, sceneKey]);
  return null;
}
function RendererSync({ id, scenes }: { readonly id: string; readonly scenes: readonly HostedScene[] }) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);
  useEffect(() => {
    documentRenderer.setRenderer(gl);
    const release = documentRenderer.invalidator(id, invalidate);
    const after = addAfterEffect(() => documentRenderer.capture(id, gl, size.width, size.height));
    for (const item of scenes) item.runtime.listeners.add(invalidate);
    invalidate();
    return () => { release(); after(); for (const item of scenes) item.runtime.listeners.delete(invalidate); };
  }, [id, scenes, gl, invalidate, size.width, size.height]);
  return null;
}
function UnavailableFrame({ id }: { readonly id: string }) {
  useEffect(() => { documentRenderer.failed(id); }, [id]);
  return <div className={styles.staticField} />;
}
class CanvasBoundary extends Component<{ readonly id: string; readonly fallback: ReactNode; readonly children: ReactNode }, { readonly failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override componentDidCatch(_error: Error, _info: ErrorInfo) { documentRenderer.failed(this.props.id); }
  override render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function SharedRenderer({ id, scenes }: { readonly id: string; readonly scenes: readonly HostedScene[] }) {
  const still = scenes.every((item) => item.input.quality === "still");
  const fallback = <UnavailableFrame id={id} />;
  return <CanvasBoundary id={id} fallback={fallback}>
    {scenes.map((item, index) => {
      const Renderer = sceneRenderers[item.scene.id];
      if (Renderer === undefined) throw new Error(`Missing renderer ${item.scene.id}`);
      const camera = item.scene.camera ?? { position: [0, 0, 5] as const, fov: 50 };
      return <View key={`${id}:${item.key}`} index={index + 1} className={styles.view ?? ""} data-scene-key={item.key} data-scene-id={item.scene.id}>
        <SceneRuntimeContext value={item.runtime}>
          <PerspectiveCamera makeDefault position={[...camera.position]} fov={camera.fov} onUpdate={(node) => node.lookAt(0, 0, 0)} />
          <Suspense fallback={null}><RuntimeFrame><Renderer {...item.input} /></RuntimeFrame><SceneReady id={id} sceneKey={item.key} /></Suspense>
        </SceneRuntimeContext>
      </View>;
    })}
    <Canvas dpr={[1, 1.6]} frameloop={still ? "demand" : "always"} gl={{ alpha: true }} fallback={<div className={styles.staticField} />}>
      <View.Port /><RendererSync id={id} scenes={scenes} />
    </Canvas>
  </CanvasBoundary>;
}
export default memo(function SceneCanvas({ scenes, contained }: { readonly scenes: readonly HostedScene[]; readonly contained: boolean }) {
  const id = useId(); const node = useRef<HTMLDivElement>(null); const poster = useRef<HTMLDivElement>(null);
  const initial = useRef(scenes);
  useEffect(() => {
    const host = node.current; const image = poster.current; if (host === null || image === null) return;
    documentRenderer.mount(id, host, image, initial.current, contained);
    const scope = host.closest("[data-backdrop-focus-scope]") ?? host.closest('[role="dialog"]') ?? host.parentElement;
    const focus = () => documentRenderer.lease.focus(id);
    scope?.addEventListener("focusin", focus); scope?.addEventListener("pointerdown", focus);
    return () => { scope?.removeEventListener("focusin", focus); scope?.removeEventListener("pointerdown", focus); documentRenderer.remove(id); };
  }, [id, contained]);
  useEffect(() => { documentRenderer.update(id, scenes); }, [id, scenes]);
  return <div ref={node} className={styles.canvas} data-webgl-host={id} data-live-renderer="false"><div ref={poster} className={`${styles.staticField} ${styles.poster ?? ""}`} data-frame="initializing" /></div>;
});
