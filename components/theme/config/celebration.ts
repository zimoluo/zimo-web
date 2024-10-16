const celebrationConfig: ThemeDataConfig = {
  palette: {
    primary: [229, 240, 250],
    saturated: [160, 187, 215],
    middle: [108, 146, 184],
    soft: [73, 110, 148],
    pastel: [51, 85, 118],
    light: [34, 61, 86],
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
  siteThemeColor: "#227fdd",
  favicon: {
    mode: "separate",
    outline: "#dae7f3",
    gradient: [
      {
        stops: [
          { color: "#426280", offset: 0 },
          { color: "#1e334d", offset: 1 },
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
