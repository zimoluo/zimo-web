const photosConfig: ThemeDataConfig = {
  palette: {
    primary: [124, 45, 18],
    saturated: [194, 65, 12],
    pastel: [254, 215, 170],
    light: [255, 247, 237],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [255, 237, 229],
            opacity: 1,
            at: 0,
          },
          {
            color: [255, 237, 229],
            opacity: 1,
            at: 15,
          },
          {
            color: [255, 251, 228],
            opacity: 1,
            at: 85,
          },
          {
            color: [255, 251, 228],
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
            color: [255, 242, 235],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 15,
          },
          {
            color: [255, 247, 237],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 85,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffedd5",
  favicon: {
    mode: "separate",
    outline: "#a24700",
    gradient: [
      {
        stops: [
          {
            color: "#ffbc00",
            offset: 0,
          },
          {
            color: "#ff4f00",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "photos",
};

export default photosConfig;
