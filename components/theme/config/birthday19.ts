const birthday19Config: ThemeDataConfig = {
  palette: {
    primary: [232, 238, 248],
    light: [35, 75, 136],
    saturated: [167, 192, 228],
    middle: [123, 160, 216],
    pastel: [48, 100, 179],
    soft: [78, 129, 205],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { color: [19, 110, 74], at: 0.4, opacity: 0.7 },
          { color: [97, 209, 96], at: 225, opacity: 0 },
        ],
        posX: 80,
        posY: 105,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [199, 116, 82], at: 0, opacity: 0.7 },
          { color: [96, 167, 209], at: 120, opacity: 0 },
        ],
        posX: -4,
        posY: 28,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [164, 7, 7], at: 0, opacity: 0.58 },
          { color: [178, 24, 24], at: 85, opacity: 0 },
        ],
        posX: 120,
        posY: 40,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
      {
        type: "linear-gradient",
        stops: [
          { color: [12, 67, 109], opacity: 1, at: 20 },
          { color: [23, 75, 114], opacity: 1, at: 80 },
        ],
        angle: 45,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [12, 67, 109], opacity: 0.9, at: 20, isWidgetOpacity: true },
          { color: [23, 75, 114], opacity: 0.8, at: 80, isWidgetOpacity: true },
        ],
        angle: 45,
      },
    ],
  },
  siteThemeColor: "#3771c8",
  favicon: {
    mode: "separate",
    outline: "#d0d9e6",
    gradient: [
      {
        stops: [
          { offset: 0, color: "#1e507c" },
          { offset: 0.33, color: "#3c6ea8" },
          { offset: 0.75, color: "#087f9c" },
          { offset: 1, color: "#087f9c" },
        ],
      },
    ],
  },
  animatedBackgroundKey: "birthday19",
};

export default birthday19Config;
