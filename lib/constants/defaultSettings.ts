export const defaultSettings: SettingsState = {
  backgroundRichness: "rich",
  syncSettings: true,
  navigationBar: "flexible",
  floatingCodeSpeed: 1800,
  disableCenterPainting: false,
  disableComments: false,
  disableGestures: false,
  disableSerifFont: false,
  disableEntryPopUp: false,
  enableGallery: false,
  disableSoundEffect: false,
  pageTheme: {
    home: "home",
    photos: "photos",
    blog: "blog",
    projects: "projects",
    about: "about",
    management: "bubbles",
    design: "autumnal",
  },
  notificationStyle: "banner",
  instantSearchResult: false,
  flyingBalloonRate: 1600,
  disableTableOfContents: false,
  goldSphereAnimationIntensity: 100,
  customThemeData: [
    {
      primary: [124, 45, 18],
      light: [255, 247, 237],
      saturated: [194, 65, 12],
      middle: [251, 146, 60],
      pastel: [254, 215, 170],
      soft: [253, 186, 116],
      page: [
        {
          type: "linear-gradient",
          angle: "45deg",
          stops: [
            {
              color: "rgba(255, 237, 229, 1)",
              at: "0%",
            },
            {
              color: "rgba(255, 237, 229, 1)",
              at: "15%",
            },
            {
              color: "rgba(255, 251, 228, 1)",
              at: "85%",
            },
            {
              color: "rgba(255, 251, 228, 1)",
              at: "100%",
            },
          ],
        },
      ],
      widget: [
        {
          type: "linear-gradient",
          angle: "45deg",
          stops: [
            {
              color: "rgba(255, 242, 235, $opacity%)",
              at: "15%",
            },
            {
              color: "rgba(255, 247, 237, $opacity%)",
              at: "85%",
            },
          ],
        },
      ],
    },
  ],
  customThemeIndex: 0,
};
