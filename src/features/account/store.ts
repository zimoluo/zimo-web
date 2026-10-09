"use client";
import { create } from "zustand";
import type { AccountUser } from "./model/types";
export type AccountStore = { readonly user: AccountUser | null; readonly restored: boolean; readonly setUser: (user: AccountUser | null) => void };
export const useAccount = create<AccountStore>((set) => ({ user: null, restored: false, setUser: (user) => set({ user, restored: true }) }));
export const accountStore = { getState: useAccount.getState, subscribe: useAccount.subscribe };
