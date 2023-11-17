interface SettingsState {
  backgroundRichness: "minimal" | "reduced" | "rich";
  syncSettings: boolean;
  navigationBar: "disabled" | "always" | "flexible";
  floatingCodeSpeed: number;
  disableCenterPainting: boolean;
  disableComments: boolean;
  disableGestures: boolean;
  disableEntryPopUp: boolean;
  enableGallery: boolean;
  enableHalloweenEffect: boolean;
  disableSoundEffect: boolean;
  preferInitialGridView: boolean;
  pageTheme: Record<NavigationKey, ThemeAvailable>;
  disableToast: boolean;
}
