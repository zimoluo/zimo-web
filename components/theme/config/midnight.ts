const midnightConfig: ThemeDataConfig = {
  palette: {
    primary: [249, 250, 251],
    saturated: [243, 244, 246],
    pastel: [107, 114, 128],
    light: [75, 85, 99],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [17, 24, 39],
            opacity: 1,
            at: 0,
          },
          {
            color: [31, 41, 55],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [27, 36, 51],
            opacity: 0.7,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [37, 47, 61],
            opacity: 0.7,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#1f2937",
  favicon: {
    mode: "separate",
    outline: "#f3f4f6",
    gradient: [
      {
        stops: [
          {
            color: "#111827",
            offset: 0,
          },
          {
            color: "#374151",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "midnight",
};

export default midnightConfig;
