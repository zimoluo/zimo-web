export type BackdropMotion = "off" | "reduced" | "full";

export type TransitionMotion = "auto" | "reduced";

export type NotificationStyle = "off" | "banner" | "inline";

export type NavigationBar = "hidden" | "pinned" | "auto";

export type ResizeBehavior = "corner" | "center" | "adaptive";

export type Settings = {
  readonly version: 3;
  readonly revision: number;

  readonly reading: {
    readonly blur: number;
    readonly serif: boolean;
    readonly tableOfContents: boolean;
  };

  readonly motion: {
    readonly backdrop: BackdropMotion;
    readonly gestures: boolean;
    readonly transitions: TransitionMotion;
  };

  readonly notifications: {
    readonly style: NotificationStyle;
    readonly limit: number;
  };

  readonly comments: { readonly enabled: boolean };

  readonly sound: { readonly enabled: boolean };

  readonly navigation: {
    readonly bar: NavigationBar;
    readonly contextStrip: boolean;
  };

  readonly windows: {
    readonly limit: number;
    readonly snapping: boolean;
    readonly snapToViewport: boolean;
    readonly resizeBehavior: ResizeBehavior;
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

export type SettingsDomain = Exclude<keyof Settings, "version" | "revision">;
