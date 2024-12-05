const eventideConfig: ThemeDataConfig = {
  palette: {
    primary: [237, 241, 255],
    saturated: [156, 172, 219],
    pastel: [83, 107, 172],
    light: [44, 60, 114],
    widget: [
      {
        type: "radial-gradient",
        stops: [
          { at: 0, color: [42, 50, 94], opacity: 0.8, isWidgetOpacity: true },
          {
            at: 100,
            color: [30, 34, 61],
            opacity: 0.85,
            isWidgetOpacity: true,
          },
        ],
        posX: 50,
        posY: 100,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
    ],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { at: 0, color: [37, 40, 71], opacity: 1 },
          { at: 100, color: [23, 22, 39], opacity: 1 },
        ],
        posX: 50,
        posY: 100,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
    ],
  },
  siteThemeColor: "#171627",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#2c3c72", offset: 0 },
          { color: "#788ed0", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "eventide",
  misc: { readingBlur: 8 },
};

export default eventideConfig;
