"use client";
import { useState } from "react";
import { accountStore, deleteAccount, downloadAccountData, signOut, useAccount } from "@/src/features/account";
import { useSettings } from "@/src/features/settings";
import { useTheme } from "@/src/features/theme";
import { defaultWorkspace, workspaceStore } from "@/src/features/workspace";
import { notify, notifyError } from "@/src/features/notifications";
export default function MenuEntriesUtility() {
  const user = useAccount((state) => state.user);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const actions: Readonly<Record<string, () => void | Promise<void>>> = {
    "Reset settings": () => useSettings.getState().reset(),
    "Reset theme profiles": () => { const state = useTheme.getState(); for (let index = state.profiles.length - 1; index >= 0; index--) useTheme.getState().removeProfile(index); },
    "Reset customizations": () => { useSettings.getState().reset(); const state = useTheme.getState(); for (let index = state.profiles.length - 1; index >= 0; index--) useTheme.getState().removeProfile(index); useTheme.getState().selectEverywhere({ kind: "builtIn", id: "home" }); workspaceStore.getState().restoreWorkspace(defaultWorkspace); },
    ...(user ? {
      "Sign out": async () => { await signOut(); accountStore.getState().setUser(null); },
      "Download synced data": async () => { const stored = await downloadAccountData(); if (!stored) return; if (stored.websiteSettings) useSettings.getState().replaceAll(stored.websiteSettings); if (stored.syncedTheme) useTheme.getState().restorePreferences(stored.syncedTheme); if (stored.syncedWorkspace) workspaceStore.getState().restoreWorkspace(stored.syncedWorkspace); },
      "Delete my account": async () => { await deleteAccount(); accountStore.getState().setUser(null); },
    } : {}),
  };
  const perform = async (label: string) => { setBusy(true); try { await actions[label]?.(); setConfirmation(null); notify({ title: label, body: "Done.", icon: "cog" }); } catch (error) { notifyError(error instanceof Error ? error.message : "The action failed."); } finally { setBusy(false); } };
  return <div className="py-2">{Object.keys(actions).map((label) => <div key={label} className="border-b border-line last:border-0">{confirmation === label ? <div className="py-3"><p className="text-sm">{label}?</p><div className="flex gap-4"><button type="button" disabled={busy} className="min-h-11 grow" onClick={() => setConfirmation(null)}>Cancel</button><button type="button" disabled={busy} className="min-h-11 grow" onClick={() => void perform(label)}>Confirm</button></div></div> : <button type="button" disabled={busy} className="min-h-11 w-full py-2 text-base" onClick={() => label === "Sign out" ? void perform(label) : setConfirmation(label)}>{label}</button>}</div>)}</div>;
}
