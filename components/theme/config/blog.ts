const blogConfig: ThemeDataConfig = {
  palette: {
    primary: [112, 26, 117],
    saturated: [162, 28, 175],
    pastel: [245, 208, 254],
    light: [253, 244, 255],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [249, 232, 255],
            opacity: 1,
            at: 0,
          },
          {
            color: [249, 232, 255],
            opacity: 1,
            at: 20,
          },
          {
            color: [255, 235, 241],
            opacity: 1,
            at: 80,
          },
          {
            color: [255, 235, 241],
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
            color: [253, 244, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [253, 244, 251],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#f5d0fe",
  favicon: {
    mode: "separate",
    outline: "#880098",
    gradient: [
      {
        stops: [
          {
            color: "#e45eff",
            offset: 0,
          },
          {
            color: "#ff4f9e",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "blog",
};

export default blogConfig;
