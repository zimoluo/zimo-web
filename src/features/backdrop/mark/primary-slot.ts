let owner: string | null = null;
const waiting: string[] = [];
const listeners = new Set<() => void>();
const emit = () => { for (const listener of listeners) listener(); };

export const primaryMarkSlot = {
  read: (): string | null => owner,
  subscribe: (listener: () => void): (() => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
  acquire: (id: string): (() => void) => {
    if (!waiting.includes(id)) waiting.push(id);
    if (owner === null) { owner = waiting[0] ?? null; emit(); }
    return () => {
      const index = waiting.indexOf(id);
      if (index >= 0) waiting.splice(index, 1);
      if (owner === id) { owner = waiting[0] ?? null; emit(); }
    };
  },
};
