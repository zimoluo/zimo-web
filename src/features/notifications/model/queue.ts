export type NotificationId = string & { readonly __brand: "NotificationId" };

export type NotificationTone = "neutral" | "success" | "warning" | "danger";

export type NotificationIcon =
  | "generic"
  | "cog"
  | "comment"
  | "heart"
  | "warning"
  | "check"
  | "cross";

export type NotificationAction = { readonly label: string; readonly href: string };

export type Notification = {
  readonly id: NotificationId;
  readonly icon: NotificationIcon;
  readonly title: string;
  readonly body?: string | undefined;
  readonly tone: NotificationTone;
  readonly duration: number | null;
  readonly dedupeKey?: string | undefined;
  readonly action?: NotificationAction | undefined;
  readonly exiting?: boolean | undefined;
};

export type NotificationInput = {
  readonly title: string;
  readonly icon?: NotificationIcon | undefined;
  readonly body?: string | undefined;
  readonly tone?: NotificationTone | undefined;
  readonly duration?: number | null | undefined;
  readonly dedupeKey?: string | undefined;
  readonly action?: NotificationAction | undefined;
};

export type NotificationsState = {
  readonly queue: readonly Notification[];
  readonly active: readonly Notification[];
  readonly slots: number;
};

export const DEFAULT_DURATION = 6000;

export const EXIT_DURATION = 220;

export const emptyState = (slots = 4): NotificationsState => ({
  queue: [],
  active: [],
  slots,
});

export function normalize(input: NotificationInput, id: NotificationId): Notification {
  return {
    id,
    icon: input.icon ?? "generic",
    title: input.title,
    tone: input.tone ?? "neutral",
    duration: input.duration === undefined ? DEFAULT_DURATION : input.duration,
    ...(input.body === undefined ? {} : { body: input.body }),
    ...(input.dedupeKey === undefined ? {} : { dedupeKey: input.dedupeKey }),
    ...(input.action === undefined ? {} : { action: input.action }),
  };
}

/**
 * Move as many queued notifications into `active` as there are free slots.
 * Pure, and called synchronously inside push and dismiss -- there is no effect
 * loop and therefore no render in which queue and active disagree (F-55).
 */
export function promote(state: NotificationsState): NotificationsState {
  const room = state.slots - state.active.length;
  if (room <= 0 || state.queue.length === 0) return state;

  return {
    ...state,
    active: [...state.active, ...state.queue.slice(0, room)],
    queue: state.queue.slice(room),
  };
}

export function enqueue(
  state: NotificationsState,
  notification: Notification,
): NotificationsState {
  const key = notification.dedupeKey;

  if (key !== undefined) {
    const activeIndex = state.active.findIndex((entry) => entry.dedupeKey === key);
    if (activeIndex !== -1) {
      const active = [...state.active];
      active[activeIndex] = { ...notification, exiting: false };
      return { ...state, active };
    }

    const queueIndex = state.queue.findIndex((entry) => entry.dedupeKey === key);
    if (queueIndex !== -1) {
      const queue = [...state.queue];
      queue[queueIndex] = notification;
      return { ...state, queue };
    }
  }

  return { ...state, queue: [...state.queue, notification] };
}

export function markExiting(
  state: NotificationsState,
  id: NotificationId,
): NotificationsState {
  return {
    ...state,
    active: state.active.map((entry) =>
      entry.id === id ? { ...entry, exiting: true } : entry,
    ),
  };
}

export function remove(state: NotificationsState, id: NotificationId): NotificationsState {
  return promote({
    ...state,
    active: state.active.filter((entry) => entry.id !== id),
    queue: state.queue.filter((entry) => entry.id !== id),
  });
}

export function setSlots(state: NotificationsState, slots: number): NotificationsState {
  const bounded = Math.max(1, Math.floor(slots));

  if (bounded >= state.active.length) {
    return promote({ ...state, slots: bounded });
  }

  return {
    slots: bounded,
    active: state.active.slice(0, bounded),
    queue: [...state.active.slice(bounded), ...state.queue],
  };
}

export const clearAll = (state: NotificationsState): NotificationsState => ({
  ...state,
  queue: [],
  active: [],
});

export const totalCount = (state: NotificationsState): number =>
  state.queue.length + state.active.length;
