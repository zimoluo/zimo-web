const verdantConfig: ThemeDataConfig = {
  palette: {
    primary: [82, 116, 12],
    saturated: [121, 166, 29],
    pastel: [222, 255, 102],
    light: [243, 255, 197],
    page: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [142, 223, 34],
            opacity: 1,
            at: 0,
          },
          {
            color: [142, 223, 34],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [232, 255, 164],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [232, 255, 164],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#8edf22",
  favicon: {
    mode: "backdrop",
  },
  animatedBackgroundKey: "verdant",
};

export default verdantConfig;
