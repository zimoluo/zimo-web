const birthday19Config: ThemeDataConfig = {
  palette: {
    primary: [232, 237, 247],
    light: [28, 58, 95],
    saturated: [158, 190, 234],
    middle: [113, 154, 215],
    pastel: [52, 87, 140],
    soft: [79, 120, 182],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { color: [12, 83, 55], at: 0, opacity: 0.55 },
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
          { color: [92, 39, 17], at: 0, opacity: 0.5 },
          { color: [209, 135, 96], at: 150, opacity: 0 },
        ],
        posX: 8,
        posY: 24,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [117, 5, 5], at: 0, opacity: 0.4 },
          { color: [178, 24, 24], at: 76, opacity: 0 },
        ],
        posX: 90,
        posY: 40,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
      {
        type: "linear-gradient",
        stops: [
          { color: [21, 53, 89], opacity: 1, at: 20 },
          { color: [22, 48, 77], opacity: 1, at: 80 },
        ],
        angle: 45,
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        stops: [
          { color: [11, 79, 52], at: 0, opacity: 0.5, isWidgetOpacity: true },
          { color: [97, 209, 96], at: 150, opacity: 0 },
        ],
        posX: -2,
        posY: 20,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [117, 5, 5], at: 0, opacity: 0.4, isWidgetOpacity: true },
          { color: [178, 24, 24], at: 125, opacity: 0, isWidgetOpacity: true },
        ],
        posX: 105,
        posY: 40,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [92, 39, 17], at: 0, opacity: 0.5, isWidgetOpacity: true },
          { color: [209, 135, 96], at: 150, opacity: 0 },
        ],
        posX: 36,
        posY: 102,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
      {
        type: "linear-gradient",
        stops: [
          { color: [18, 47, 90], opacity: 0.84, at: 20, isWidgetOpacity: true },
          { color: [12, 40, 77], opacity: 0.92, at: 80, isWidgetOpacity: true },
        ],
        angle: 45,
      },
    ],
  },
  siteThemeColor: "#16304d",
  favicon: {
    mode: "separate",
    outline: "#d0d9e6",
    gradient: [
      {
        stops: [
          { offset: 0, color: "#143d62" },
          { offset: 0.34, color: "#173251" },
          { offset: 0.76, color: "#054757" },
          { offset: 1, color: "#083d4b" },
        ],
      },
    ],
  },
  animatedBackgroundKey: "birthday19",
  misc: { readingBlur: 32 },
};

export default birthday19Config;
