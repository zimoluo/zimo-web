import type { Settings } from "./model/settings";

export const SETTINGS_VERSION = 3;

export const defaultSettings: Settings = {
  version: SETTINGS_VERSION,
  revision: 0,

  reading: {
    blur: 24,
    serif: true,
    tableOfContents: true,
  },

  motion: {
    backdrop: "full",
    gestures: true,
    transitions: "auto",
  },

  notifications: {
    style: "banner",
    limit: 4,
  },

  comments: { enabled: true },

  sound: { enabled: true },

  navigation: {
    bar: "auto",
    contextStrip: true,
  },

  windows: {
    limit: 8,
    snapping: true,
    snapToViewport: true,
    resizeBehavior: "adaptive",
    restoreOnLoad: true,
  },

  studio: {
    expandWindow: false,
    extendedStopRange: false,
    showInterpolation: false,
    showLookupPanel: false,
  },

  sync: { enabled: true },

  experiments: {},
};
