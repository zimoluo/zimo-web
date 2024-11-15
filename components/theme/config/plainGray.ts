const plainGrayConfig: ThemeDataConfig = {
  palette: {
    primary: [253, 253, 253],
    saturated: [222, 222, 222],
    middle: [199, 199, 199],
    soft: [176, 176, 176],
    pastel: [153, 153, 153],
    light: [138, 138, 138],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          {
            at: 0,
            color: [153, 153, 153],
            opacity: 0.8,
            isWidgetOpacity: true,
          },
          {
            at: 100,
            color: [153, 153, 153],
            opacity: 0.8,
            isWidgetOpacity: true,
          },
        ],
        angle: 0,
      },
    ],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { at: 0, color: [164, 164, 164], opacity: 1 },
          { at: 100, color: [164, 164, 164], opacity: 1 },
        ],
        angle: 0,
      },
    ],
  },
  siteThemeColor: "#a4a4a4",
  favicon: { mode: "outline" },
  misc: { readingBlur: 0 },
};

export default plainGrayConfig;
