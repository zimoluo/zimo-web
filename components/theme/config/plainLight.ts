const plainLightConfig: ThemeDataConfig = {
  palette: {
    primary: [48, 48, 48],
    light: [250, 250, 250],
    saturated: [89, 89, 89],
    middle: [131, 131, 131],
    pastel: [212, 212, 212],
    soft: [172, 172, 172],
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
