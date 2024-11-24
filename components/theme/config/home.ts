const homeConfig: ThemeDataConfig = {
  palette: {
    primary: [48, 48, 48],
    saturated: [64, 64, 64],
    pastel: [229, 229, 229],
    light: [250, 250, 250],
    page: [
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          {
            color: [252, 252, 252],
            opacity: 1,
            at: 0,
          },
          {
            color: [252, 252, 252],
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
            color: [246, 246, 246],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [253, 253, 253],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#e5e5e5",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          {
            color: "#cacaca",
            offset: 0,
          },
          {
            color: "#f5f5f5",
            offset: 0.35,
          },
          {
            color: "#ffffff",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "home",
};

export default homeConfig;
