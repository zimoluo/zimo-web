const penumbraConfig: ThemeDataConfig = {
  palette: {
    primary: [239, 239, 240],
    saturated: [194, 195, 201],
    middle: [163, 165, 176],
    soft: [131, 135, 152],
    pastel: [102, 106, 128],
    light: [75, 78, 96],
    page: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [60, 63, 74],
            opacity: 1,
            at: 0,
          },
          {
            color: [60, 63, 74],
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
            color: [84, 88, 100],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [75, 80, 96],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#3c3f4a",
  favicon: {
    mode: "custom",
    customKey: "penumbra",
  },
  animatedBackgroundKey: "penumbra",
};

export default penumbraConfig;
