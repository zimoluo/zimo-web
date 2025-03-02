const verdantConfig: ThemeDataConfig = {
  palette: {
    primary: [242, 255, 233],
    saturated: [170, 213, 199],
    pastel: [124, 182, 183],
    light: [80, 125, 139],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { color: [64, 122, 140], opacity: 1, at: 0 },
          { color: [64, 122, 140], opacity: 1, at: 100 },
        ],
        angle: 90,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [95, 140, 146], opacity: 1, isWidgetOpacity: true, at: 0 },
          { color: [95, 140, 146], opacity: 1, isWidgetOpacity: true, at: 100 },
        ],
        angle: 30,
      },
    ],
  },
  siteThemeColor: "#407a8c",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#4B7D8C", offset: 0 },
          { color: "#AAD5C7", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "verdant",
};

export default verdantConfig;
