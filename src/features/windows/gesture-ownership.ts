import type { WindowId } from "./model";

const owners = new Map<WindowId, Set<() => void>>();

export function subscribeWindowGesture(id: WindowId, cancel: () => void): () => void {
  const listeners = owners.get(id) ?? new Set<() => void>();
  owners.set(id, listeners);
  listeners.add(cancel);
  return () => {
    listeners.delete(cancel);
    if (listeners.size === 0 && owners.get(id) === listeners) owners.delete(id);
  };
}

export function interruptWindowGesture(id: WindowId): void {
  for (const cancel of [...owners.get(id) ?? []]) cancel();
}

export function interruptWindowGestures(): void {
  for (const id of [...owners.keys()]) interruptWindowGesture(id);
}
