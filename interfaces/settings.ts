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
  notificationStyle: "disabled" | "toast" | "banner";
  instantSearchResult: boolean;
  flyingBalloonRate: number;
  disableTableOfContents: boolean;
}
