interface SettingsState {
  backgroundRichness: "minimal" | "reduced" | "rich";
  syncSettings: boolean;
  navigationBar: "disabled" | "always" | "flexible";
  floatingCodeSpeed: number;
  disableCenterPainting: boolean;
  disableComments: boolean;
  disableGestures: boolean;
  disableSerifFont: boolean;
  disableEntryPopUp: boolean;
  enableGallery: boolean;
  disableSoundEffect: boolean;
  pageTheme: Record<NavigationKey, ThemeAvailable>;
  notificationStyle: NotificationStyle;
  instantSearchResult: boolean;
  flyingBalloonRate: number;
  disableTableOfContents: boolean;
  goldSphereAnimationIntensity: number;
  customThemeData: {
    primary: [number, number, number];
    saturated: [number, number, number];
    middle: [number, number, number];
    soft: [number, number, number];
    pastel: [number, number, number];
    light: [number, number, number];
  }[];
  customThemeIndex: number;
}

type NotificationStyle = "disabled" | "toast" | "banner";
