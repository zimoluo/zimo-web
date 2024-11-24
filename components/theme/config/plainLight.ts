const plainLightConfig: ThemeDataConfig = {
  palette: {
    primary: [48, 48, 48],
    saturated: [89, 89, 89],
    pastel: [212, 212, 212],
    light: [250, 250, 250],
    page: [
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          { color: [255, 255, 255], opacity: 1, at: 0 },
          { color: [255, 255, 255], opacity: 1, at: 100 },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          { color: [251, 251, 251], opacity: 1, isWidgetOpacity: true, at: 0 },
          {
            color: [251, 251, 251],
            opacity: 1,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffffff",
  favicon: { mode: "outline" },
  misc: { readingBlur: 0 },
};

export default plainLightConfig;
