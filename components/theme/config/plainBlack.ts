const plainBlackConfig: ThemeDataConfig = {
  palette: {
    primary: [244, 244, 244],
    saturated: [180, 180, 180],
    pastel: [80, 80, 80],
    light: [28, 28, 28],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { color: [0, 0, 0], opacity: 1, at: 0 },
          { color: [0, 0, 0], opacity: 1, at: 100 },
        ],
        angle: 0,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [36, 36, 36], opacity: 0.75, isWidgetOpacity: true, at: 0 },
          {
            color: [36, 36, 36],
            opacity: 0.75,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
        angle: 0,
      },
    ],
  },
  siteThemeColor: "#000000",
  favicon: { mode: "outline" },
  misc: { readingBlur: 0 },
};

export default plainBlackConfig;
