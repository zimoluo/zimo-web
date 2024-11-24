const celebrationConfig: ThemeDataConfig = {
  palette: {
    primary: [231, 239, 246],
    saturated: [191, 213, 237],
    pastel: [69, 95, 119],
    light: [46, 67, 85],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { color: [31, 53, 80], opacity: 1, at: 0 },
          { color: [21, 23, 37], opacity: 1, at: 100 },
        ],
        posX: 50,
        posY: 102,
        sizeX: 95,
        sizeY: 116,
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        stops: [
          { color: [33, 52, 75], opacity: 0.5, isWidgetOpacity: true, at: 0 },
          { color: [16, 34, 57], opacity: 0.5, isWidgetOpacity: true, at: 100 },
        ],
        posX: 50,
        posY: 102,
        sizeX: 90,
        sizeY: 120,
      },
    ],
  },
  siteThemeColor: "#22273d",
  favicon: {
    mode: "separate",
    outline: "#dae7f3",
    gradient: [
      {
        stops: [
          { color: "#5f7385", offset: 0 },
          { color: "#2b3c50", offset: 1 },
        ],
        angle: 135,
      },
    ],
  },
  animatedBackgroundKey: "celebration",
  misc: {
    readingBlur: 16,
  },
};

export default celebrationConfig;
