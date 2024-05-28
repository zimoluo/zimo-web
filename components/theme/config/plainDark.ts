const plainDarkConfig: ThemeDataConfig = {
  palette: {
    primary: [251, 251, 251],
    light: [72, 72, 72],
    saturated: [206, 206, 206],
    soft: [141, 141, 141],
    pastel: [105, 105, 105],
    middle: [170, 170, 170],
    page: [
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          { color: [61, 61, 61], opacity: 1, at: 0 },
          { color: [62, 62, 62], opacity: 1, at: 100 },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          { color: [73, 73, 73], opacity: 1, isWidgetOpacity: true, at: 0 },
          { color: [73, 73, 73], opacity: 1, isWidgetOpacity: true, at: 100 },
        ],
      },
    ],
  },
  siteThemeColor: "#3e3e3e",
  favicon: { mode: "outline" },
  misc: { readingBlur: 0 },
};

export default plainDarkConfig;
