"use client";
import { create } from "zustand";
import { treeBoardSchema } from "./model";
import type { TreeMessage } from "./model";
type TreeStore = {
  readonly messages: readonly TreeMessage[];
  readonly occupiedPositions: readonly (readonly [number,number])[];
  readonly error: string;
  readonly refresh: () => Promise<void>;
};
export const useTree = create<TreeStore>()((set) => ({
  messages: [], occupiedPositions: [], error: "",
  refresh: async () => {
    try {
      const response = await fetch("/api/v1/tree-messages");
      if (!response.ok) throw new Error("Could not load the Christmas tree.");
      const board = treeBoardSchema.parse(await response.json());
      set({ messages: board.messages.filter((message) => message.isPublic === true), occupiedPositions: board.occupiedPositions ?? board.messages.map((message) => message.position), error: "" });
    } catch (cause) { set({ error: cause instanceof Error ? cause.message : "Could not load the Christmas tree." }); }
  },
}));
