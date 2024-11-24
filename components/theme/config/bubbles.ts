const bubblesConfig: ThemeDataConfig = {
  palette: {
    primary: [21, 66, 124],
    saturated: [16, 91, 188],
    pastel: [188, 224, 253],
    light: [239, 247, 255],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [232, 244, 255],
            opacity: 1,
            at: 20,
          },
          {
            color: [235, 249, 255],
            opacity: 1,
            at: 80,
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
            color: [242, 249, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 15,
          },
          {
            color: [242, 252, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 85,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ddeefe",
  favicon: {
    mode: "separate",
    outline: "#0369a1",
    gradient: [
      {
        stops: [
          {
            color: "#3aafff",
            offset: 0,
          },
          {
            color: "#bae4fd",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "bubbles",
};

export default bubblesConfig;
