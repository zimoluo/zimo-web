const murkConfig: ThemeDataConfig = {
  palette: {
    primary: [232, 246, 247],
    saturated: [169, 221, 226],
    pastel: [65, 161, 171],
    light: [38, 119, 128],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          {
            at: 0,
            color: [36, 112, 105],
            opacity: 0.92,
            isWidgetOpacity: true,
          },
          {
            at: 50,
            color: [38, 122, 118],
            opacity: 0.9,
            isWidgetOpacity: true,
          },
          {
            at: 100,
            color: [34, 104, 109],
            opacity: 0.88,
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
          { at: 0, color: [45, 134, 125], opacity: 1 },
          { at: 50, color: [44, 142, 137], opacity: 1 },
          { at: 100, color: [36, 125, 131], opacity: 1 },
        ],
        angle: 0,
      },
    ],
  },
  siteThemeColor: "#3bb7c4",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#396877", offset: 0 },
          { color: "#254b58", offset: 0.3 },
          { color: "#5ed0c4", offset: 1 },
        ],
        angle: 280,
      },
    ],
  },
  animatedBackgroundKey: "murk",
  misc: { readingBlur: 8 },
};

export default murkConfig;
