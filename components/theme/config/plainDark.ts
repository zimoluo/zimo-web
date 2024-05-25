const plainDarkConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 255, 255],
    light: [50, 50, 50],
    saturated: [229, 229, 229],
    soft: [96, 96, 96],
    pastel: [78, 78, 78],
    middle: [128, 128, 128],
    page: [
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          {
            color: [50, 50, 50],
            opacity: 1,
            at: 0,
          },
          {
            color: [50, 50, 50],
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
            color: [64, 64, 64],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [64, 64, 64],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#323232",
  favicon: {
    mode: "outline",
  },
};

export default plainDarkConfig;
