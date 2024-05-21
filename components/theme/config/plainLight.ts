const plainLightConfig: ThemeDataConfig = {
  palette: {
    primary: [10, 10, 10],
    light: [255, 255, 255],
    saturated: [64, 64, 64],
    middle: [163, 163, 163],
    pastel: [229, 229, 229],
    soft: [212, 212, 212],
    page: [
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          {
            color: [255, 255, 255],
            opacity: 1,
            at: 0,
          },
          {
            color: [255, 255, 255],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          {
            color: [248, 248, 248],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [248, 248, 248],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffffff",
  favicon: {
    mode: "outline",
  },
};

export default plainLightConfig;
