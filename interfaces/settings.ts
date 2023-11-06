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
  disableBackgroundBlur: boolean;
  enableGallery: boolean;
  preferredManagementTheme: "zimo" | "about";
  enableHalloweenEffect: boolean;
  disableSoundEffect: boolean;
  preferInitialGridView: boolean;
}
