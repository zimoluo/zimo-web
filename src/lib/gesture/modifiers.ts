export type ModifierState = {
  readonly shift: boolean;
  readonly alt: boolean;
  readonly meta: boolean;
  readonly ctrl: boolean;
};

export type ModifierEventLike = {
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
};

export type ModifierTarget = {
  addEventListener: (type: string, listener: (event: Event) => void) => void;
  removeEventListener: (type: string, listener: (event: Event) => void) => void;
};

export type ModifierTracker = {
  readonly current: () => ModifierState;
  readonly subscribe: (listener: (state: ModifierState) => void) => () => void;
  readonly listening: () => boolean;
  readonly subscribers: () => number;
};

export const NEUTRAL_MODIFIERS: ModifierState = {
  shift: false,
  alt: false,
  meta: false,
  ctrl: false,
};

export const readModifiers = (event: ModifierEventLike): ModifierState => ({
  shift: event.shiftKey,
  alt: event.altKey,
  meta: event.metaKey,
  ctrl: event.ctrlKey,
});

export const sameModifiers = (a: ModifierState, b: ModifierState): boolean =>
  a.shift === b.shift &&
  a.alt === b.alt &&
  a.meta === b.meta &&
  a.ctrl === b.ctrl;

export function createModifierTracker(target: ModifierTarget): ModifierTracker {
  const listeners = new Set<(state: ModifierState) => void>();
  let state = NEUTRAL_MODIFIERS;
  let listening = false;

  const publish = (next: ModifierState): void => {
    if (sameModifiers(state, next)) return;
    state = next;
    for (const listener of [...listeners]) listener(state);
  };

  const onKey = (event: Event): void => {
    const source = event as Event & Partial<ModifierEventLike>;
    publish({
      shift: source.shiftKey === true,
      alt: source.altKey === true,
      meta: source.metaKey === true,
      ctrl: source.ctrlKey === true,
    });
  };

  const onBlur = (): void => {
    publish(NEUTRAL_MODIFIERS);
  };

  const attach = (): void => {
    if (listening) return;
    listening = true;
    target.addEventListener("keydown", onKey);
    target.addEventListener("keyup", onKey);
    target.addEventListener("blur", onBlur);
  };

  const detach = (): void => {
    if (!listening) return;
    listening = false;
    state = NEUTRAL_MODIFIERS;
    target.removeEventListener("keydown", onKey);
    target.removeEventListener("keyup", onKey);
    target.removeEventListener("blur", onBlur);
  };

  return {
    current: () => state,
    listening: () => listening,
    subscribers: () => listeners.size,

    subscribe: (listener) => {
      listeners.add(listener);
      attach();
      let live = true;
      return () => {
        if (!live) return;
        live = false;
        listeners.delete(listener);
        if (listeners.size === 0) detach();
      };
    },
  };
}

let shared: ModifierTracker | null = null;

export const sharedModifierTracker = (): ModifierTracker => {
  if (shared === null) shared = createModifierTracker(window);
  return shared;
};
