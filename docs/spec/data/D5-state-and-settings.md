# D5 — State and settings

Resolves F-35 – F-37, F-42. Location: `src/features/*/store.ts`, `src/lib/store/`.

The single largest performance defect in the codebase: one monolithic settings object, exposed
through React context, consumed by **115 files**. Any change to any of its 41 fields re-renders
every one of those subtrees. It also holds 16 full theme profiles, the window layout, and the
notebook contents, and it is `JSON.stringify`d to `localStorage` synchronously on every update —
including on every frame of a window drag.

## 1. Store choice

**Zustand v5**, with `subscribeWithSelector`, `persist`, and `immer`.

Justification against the alternatives (ADR-012):

| Option | Verdict |
| --- | --- |
| Keep React context, split into ~8 contexts | Reduces the blast radius but does not eliminate it: a context still re-renders every consumer when its value changes, so `windows` would still re-render every window on any window's change. Also 8 providers to nest. |
| `useSyncExternalStore` by hand | Zero dependencies and genuinely viable. Rejected because `persist`'s versioned `migrate` is *exactly* the settings-migration mechanism this spec needs (§5), and re-implementing it correctly is more code than the dependency. |
| Redux Toolkit | Heavier, and its idioms (action types, thunks) buy nothing here. |
| Jotai / Recoil | Atom-per-value fits, but the settings object needs to be persisted and migrated as a unit, which atoms make awkward. |
| **Zustand** | Selector subscriptions with `useShallow`, `persist` with `version`/`migrate`/`partialize`/custom storage, `subscribeWithSelector` for the imperative theme path (T4 §5), 4 KB. |

Rule from `02-conventions §4`, restated because it is the whole point: **a component subscribes
to a selector, never to an object.**

```ts
const blur = useSettings(s => s.reading.blur);            // ✔ re-renders when blur changes
const { settings } = useSettings();                       // ✘ forbidden by lint rule
```

An ESLint rule (`no-restricted-syntax`) rejects a `useSettings()` call with no selector argument.

## 2. Slices

`SettingsState`'s 41 flat fields become six stores. The division is by **change frequency and
ownership**, not by topic — that is what makes the selector discipline effective.

| Store | Contents | Persisted | Synced to account | Write frequency |
| --- | --- | --- | --- | --- |
| `settingsStore` | User preferences: reading, motion, notifications, gestures, sound, richness | ✓ `zw.settings` | ✓ | rare (explicit user action) |
| `themeStore` | Active theme per route, scheme, profile list, active profile index | ✓ `zw.theme` | ✓ | occasional |
| `studioStore` | The theme draft + selection + undo history (T8 §2) | ✗ | ✗ | very high (pointer rate) |
| `windowStore` | Window instances, geometry, z-order | ✓ `zw.windows` (throttled) | ✗ | high (drag/resize) |
| `notificationStore` | Queue + active slots | ✗ | ✗ | bursty |
| `overlayStore` | Modal overlay stack (P2 §10) | ✗ | ✗ | low |
| `sessionStore` | User identity, auth state | ✗ (cookie is the source) | — | rare |
| `workspaceStore` | Notebook pages, sticky notes, calculator state | ✓ `zw.workspace` | ✓ | medium |

Consequences:

- **`studioStore` is not persisted at all.** A color-picker drag writes to memory; a debounced
  commit (300 ms) copies the draft into `themeStore.profiles[i]`, which then persists. This alone
  removes F-36's synchronous 40-field stringify from the pointer path.
- **`windowStore` persists to its own key.** Dragging a window no longer rewrites 16 theme
  profiles. Today `saveWindows()` → `updateSettings({ windowSaveData })` → stringify everything.
- **`notificationStore` is ephemeral.** Notifications were never in settings, but they were in a
  context that also carried `settings` (`ToastProvider` calls `useSettings`), so appending a
  toast re-rendered settings consumers.

Cross-store reads use a plain function, not a hook, so no subscription is created:
`themeStore.getState().scheme`.

## 3. Settings schema

```ts
export type Settings = {
  readonly version: 3;
  readonly revision: number;                 // monotonic, for sync conflict resolution (§5)

  readonly reading: {
    readonly blur: number;                   // was themeConfig.misc.readingBlur
    readonly serif: boolean;                 // was disableSerifFont (inverted)
    readonly tableOfContents: boolean;       // was disableTableOfContents (inverted)
  };
  readonly motion: {
    readonly backdrop: "off" | "reduced" | "full";   // was backgroundRichness minimal/reduced/rich
    readonly gestures: boolean;              // was disableGestures (inverted)
    readonly transitions: "auto" | "reduced";// new: explicit override of prefers-reduced-motion
  };
  readonly notifications: {
    readonly style: "off" | "banner" | "inline";
    readonly limit: number;
  };
  readonly comments: { readonly enabled: boolean };
  readonly sound: { readonly enabled: boolean };
  readonly navigation: {
    readonly bar: "hidden" | "pinned" | "auto";
    readonly contextStrip: boolean;           // new, U2
  };
  readonly windows: {
    readonly limit: number;
    readonly snapping: boolean;
    readonly snapToViewport: boolean;
    readonly resizeBehavior: "corner" | "center" | "adaptive";
    readonly restoreOnLoad: boolean;
  };
  readonly studio: {
    readonly expandWindow: boolean;
    readonly extendedStopRange: boolean;
    readonly showInterpolation: boolean;
    readonly showLookupPanel: boolean;
  };
  readonly sync: { readonly enabled: boolean };
  readonly experiments: Readonly<Record<string, boolean>>;
};
```

Three rules applied throughout:

1. **No inverted booleans.** 12 of the 41 fields are `disableX`, so every call site reads
   `!settings.disableX` and a default of `false` means "enabled". `serif: true` is legible;
   `disableSerifFont: false` is a double negative. The migration inverts them.
2. **Nested by domain**, so a selector is `s => s.motion.backdrop` and a whole domain can be
   passed to a subsystem without exposing the rest.
3. **No content in settings.** `notebookData`, `customThemeData`, `windowSaveData`, and
   `viewedChristmasTreeMessages` are not preferences. They move to `workspaceStore`,
   `themeStore.profiles`, `windowStore`, and `workspaceStore` respectively.

Removed outright:
- `floatingCodeSpeed`, `flyingBalloonRate`, `goldSphereAnimationIntensity`,
  `alwaysEnableFireworks`, `disableCenterPainting`, `disableGallery3DFaviconMouseTracking` —
  six per-backdrop tuning knobs in global settings. They become **scene params** (T6 §2), where
  they belong, editable in the Studio, per theme.
- `optimizeProfileExport` — export is now minimal by construction (T4 §7).
- `disableSpecialTheme`, `darkModeThemesOverride`, `randomizeThemeOnEveryVisit` — replaced by
  `themeStore` concepts: seasonal opt-out, scheme preference, and a shuffle action.
- `enableGallery`, `hasOpenedStickyNotes`, `disableEntryPopUp` — feature flags and one-shot
  onboarding state; move to `experiments` and `workspaceStore`.
- `calculatorAppearance` → `workspaceStore.calculator.appearance`.

41 flat fields → 24 nested preferences plus three owned-elsewhere collections.

## 4. Persistence

```ts
persist(immer(creator), {
  name: "zw.settings",
  version: 3,
  storage: createThrottledJsonStorage({ delayMs: 250, flushOn: ["pagehide", "visibilitychange"] }),
  partialize: s => ({ version: s.version, revision: s.revision, ...preferencesOf(s) }),
  migrate: migrateSettings,
})
```

`createThrottledJsonStorage` (`lib/store/throttled-storage.ts`):
- Coalesces writes on a 250 ms trailing edge.
- Flushes synchronously on `pagehide` and on `visibilitychange → hidden`. Not `beforeunload`,
  which is unreliable on mobile and blocks the back-forward cache.
- Writes each store to its own key, so a window drag touches `zw.windows` only.

`windowStore` uses the same helper with `delayMs: 500`, because window geometry changes fastest
and is the least valuable to persist precisely.

F-36's cost, concretely: a window drag currently produces one `JSON.stringify` of ~41 fields
including 16 theme profiles per `saveWindows()` call, and `saveWindows()` is called on drag end,
resize end, activation, mount, and window cleanup. Under this design a drag produces one
`zw.windows` write, 500 ms after the drag stops.

## 5. Account sync

The current design: `SettingsProvider` has an effect on `[settings]` that copies settings onto
the user object; `updateSettings` separately calls `syncUpUserSettings` on every update when
`syncSettings` is on. So a color-picker drag issues a network PUT per frame.

v11:
- **`revision` is monotonic**, incremented on every local preference change.
- Sync is **debounced 2 s idle**, and flushed on `pagehide` via `navigator.sendBeacon`.
- The server's `syncSettings` update function (D4 §3.4) rejects a payload whose `revision` is
  lower than the stored one, so a slow device cannot clobber a fast one.
- On sign-in, local and remote are reconciled by `revision`: higher wins wholesale. Field-level
  merge is deliberately not attempted — preferences are not independently meaningful (a theme id
  and a scheme have to agree), and last-writer-wins-by-revision is predictable, which matters
  more than being clever.
- **`sync.enabled: false` means no upload at all**, including no `websiteSettings: null` write.
  Today `SettingsProvider`'s effect writes `websiteSettings: null` onto the user when sync is off,
  which is a write.

## 6. Reading settings on the server

Some preferences affect the server render: `reading.serif`, `reading.tableOfContents`,
`navigation.bar`, and the theme id and scheme. Today all of them are client-only, so the server
renders a default and the client corrects it after hydration — which is the source of the
`ReadingContentProcessor` font swap and the theme flash.

v11 mirrors a **small** subset into a cookie, `zw.render`, written by the client whenever those
values change:

```
zw.render = t=velvet&s=dark&f=serif&toc=1&nav=auto
```

~40 bytes, `SameSite=Lax`, not `HttpOnly` (the client writes it), read by the root layout. The
rest of settings stays in `localStorage`. This buys a correct first paint for the four
preferences that are visible in the first frame, without putting 24 preferences on every request.

## 7. Deleted

| File | Replaced by |
| --- | --- |
| `components/contexts/SettingsContext.tsx` | `features/settings/store.ts` |
| `components/contexts/ThemeContext.tsx` | `features/theme/store.ts` |
| `components/contexts/ToastContext.tsx` | `features/notifications/store.ts` |
| `components/contexts/WindowContext.tsx` | `features/windows/store.ts` (P2) |
| `components/contexts/PopUpContext.tsx` | `features/overlays/store.ts` (P2 §10) |
| `components/contexts/UserContext.tsx` | `features/account/store.ts` |
| `components/contexts/MenuControlContext.tsx` | `features/navigation/store.ts` (shrunk — U2 §5) |
| `components/theme/util/ThemeDataInitializer.tsx` | not needed |
| `lib/constants/defaultSettings.ts` | `features/settings/defaults.ts` (24 fields, no theme imports) |

Note the last one: `defaultSettings.ts` currently imports five theme config modules and calls
`generatePenumbraConfig` ten times at module scope, so importing *settings defaults* pulls in the
theme engine and executes 400 HSL conversions. That is why `useSettings` appearing in 115 files
is expensive beyond re-rendering.

Retained as contexts, because they carry stable identities rather than data:
`WindowActionContext` (per-window handles), `PopUpActionContext`, `EntryWindowContext`,
`CommentContext` (a resource location), `ReplyContext`.

All 20 `createContext` call sites are accounted for. The remainder:

| Context | Disposition |
| --- | --- |
| `GoogleOAuthContext` | **Retained as-is.** It is a thin wrapper over `@react-oauth/google`'s provider and carries a client id, not state. |
| `NotebookContext` | → `workspaceStore.notebook` (H-06). Currently carries page index and content — data, so it goes. |
| `FilterSearchContext` | → `features/search/` (H-07). Four instantiations become views over one search module. |
| `ChristmasTreeSelectorContext` (`app/christmas-tree/`) | Moves with its feature to `features/christmas-tree/`; it carries a two-field selection, which is legitimately local UI state. **Retained as a context**, scoped to that feature. |
| The five Studio contexts (`ColorPanel`, `GradientData`, `AccentColor`, `GradientStopsPosition`, `FaviconEditor`) | → `studioStore` slices plus small selection-only contexts (T8 §1). |

## 8. Acceptance

| # | Criterion |
| --- | --- |
| C1 | No component subscribes to a whole store object; lint rule enforces a selector argument |
| C2 | Changing `reading.blur` re-renders only components selecting `reading.blur` (Profiler) |
| C3 | Dragging a window performs 0 writes to `zw.settings` and `zw.theme` |
| C4 | Dragging a window for 3 s performs exactly 1 `zw.windows` write, ≥ 500 ms after release |
| C5 | A Studio drag performs 0 network requests; exactly 1 PUT 2 s after release |
| C6 | `migrateSettings` lifts a v1 `SettingsState` (all 41 fields, including 14 inverted booleans) to v3 with no loss of user intent; table-tested per field |
| C7 | No `disable*` field in `Settings` |
| C8 | `features/settings/defaults.ts` imports nothing from `features/theme` |
| C9 | Two-device conflict test: lower `revision` does not clobber higher |
| C10 | `zw.render` cookie ≤ 64 bytes; a cold load in dark mode shows no theme flash (visual test) |
| C11 | Files containing `"use client"` ≤ 120 |
