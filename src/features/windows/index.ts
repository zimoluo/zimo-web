export { WindowLayer } from "./ui/WindowLayer";
export { useWindows, windowStore } from "./store";
export { openWindowDefinition } from "./open";
export { useWindowIdentity, useWindowInstance } from "./window-identity";
export { windowDefinitions, definitionLookup, settingsTagsFor, definitionOf, WINDOW_DEFINITION_IDS } from "./definitions";
export type { KnownWindowId, SettingsTag } from "./definitions";
export type { WindowId, WindowDefinitionId, WindowInstance } from "./model";
export { restoreLayout } from "./restore";
export { solveTidy } from "./geometry/solve-snap";
export { insetsFrom, viewportOf } from "./viewport";

export { EntryOverlay } from "./ui/EntryReader";
