const goldConfig: ThemeDataConfig = {
  palette: {
    primary: [113, 72, 18],
    saturated: [181, 134, 11],
    pastel: [250, 224, 157],
    light: [254, 247, 232],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [255, 249, 235],
            opacity: 1,
            at: 0,
          },
          {
            color: [255, 249, 235],
            opacity: 1,
            at: 20,
          },
          {
            color: [255, 253, 242],
            opacity: 1,
            at: 80,
          },
          {
            color: [255, 253, 242],
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
            color: [255, 246, 227],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [255, 250, 235],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#f9d986",
  favicon: {
    mode: "separate",
    outline: "#b68b00",
    gradient: [
      {
        stops: [
          {
            color: "#ffe5a0",
            offset: 0,
          },
          {
            color: "#ecb010",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "gold",
};

export default goldConfig;
