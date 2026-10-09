"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { v7 as uuidv7 } from "uuid";
import {
  emptyState,
  enqueue,
  EXIT_DURATION,
  markExiting,
  normalize,
  promote,
  remove,
  setSlots,
} from "./model/queue";
import type {
  Notification,
  NotificationId,
  NotificationInput,
  NotificationsState,
} from "./model/queue";

export type NotificationStore = NotificationsState & {
  readonly enabled: boolean;
  readonly push: (input: NotificationInput) => NotificationId;
  readonly dismiss: (id: NotificationId) => void;
  readonly drop: (id: NotificationId) => void;
  readonly configure: (slots: number, enabled?: boolean) => void;
  readonly clear: () => void;
};

const timers = new Map<NotificationId, ReturnType<typeof setTimeout>>();

const cancel = (id: NotificationId): void => {
  const timer = timers.get(id);
  if (timer !== undefined) {
    clearTimeout(timer);
    timers.delete(id);
  }
};

export const useNotifications = create<NotificationStore>()(
  subscribeWithSelector((set, get) => ({
    ...emptyState(),
    enabled: true,

    push: (input) => {
      const id = uuidv7() as NotificationId;
      if (!get().enabled || !input.title.trim()) return id;
      const prepared = { ...input, title: input.title.trim(), body: input.body?.trim() };
      set((state) => promote(enqueue(state, normalize(prepared, id))));
      return id;
    },

    dismiss: (id) => {
      cancel(id);
      set((state) => markExiting(state, id));

      timers.set(
        id,
        setTimeout(() => {
          timers.delete(id);
          get().drop(id);
        }, EXIT_DURATION),
      );
    },

    drop: (id) => {
      cancel(id);
      set((state) => promote(remove(state, id)));
    },

    configure: (slots, enabled = true) => {
      if (!enabled) get().clear();
      set((state) => ({ ...promote(setSlots(state, slots)), enabled }));
    },

    clear: () => {
      for (const id of timers.keys()) cancel(id);
      set((state) => ({ ...emptyState(state.slots) }));
    },
  })),
);

export const selectActive = (state: NotificationStore): readonly Notification[] =>
  state.active;

export const selectWaiting = (state: NotificationStore): number =>
  state.queue.length;

export const selectSlots = (state: NotificationStore): number => state.slots;

export const notify = (input: NotificationInput): NotificationId =>
  useNotifications.getState().push(input);

export const notifyError = (message: string): NotificationId =>
  notify({ title: message, tone: "danger", icon: "warning" });

export const pendingTimers = (): number => timers.size;
