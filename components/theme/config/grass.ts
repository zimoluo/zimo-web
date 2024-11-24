const grassConfig: ThemeDataConfig = {
  palette: {
    primary: [251, 255, 250],
    saturated: [211, 237, 197],
    pastel: [97, 179, 50],
    light: [67, 135, 27],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [60, 125, 22],
            opacity: 1,
            at: 0,
          },
          {
            color: [61, 140, 15],
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
            color: [65, 128, 28],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [58, 133, 15],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#41801c",
  favicon: {
    mode: "separate",
    outline: "#fbfffa",
    gradient: [
      {
        stops: [
          {
            color: "#117e06",
            offset: 0,
          },
          {
            color: "#91c152",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "grass",
  misc: {
    readingBlur: 12,
  },
};

export default grassConfig;
