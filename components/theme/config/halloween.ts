const halloweenConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 252, 247],
    saturated: [255, 172, 35],
    pastel: [201, 107, 26],
    light: [205, 88, 44],
    page: [
      {
        type: "linear-gradient",
        angle: 10,
        stops: [
          {
            color: [31, 15, 60],
            opacity: 1,
            at: 15,
          },
          {
            color: [107, 24, 141],
            opacity: 1,
            at: 85,
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
            color: [205, 88, 44],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 15,
          },
          {
            color: [234, 131, 5],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 85,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#6b188d",
  favicon: {
    mode: "separate",
    outline: "#ffdecb",
    gradient: [
      {
        stops: [
          {
            color: "#ff9225",
            offset: 0,
          },
          {
            color: "#7e1e81",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "halloween",
};

export default halloweenConfig;
