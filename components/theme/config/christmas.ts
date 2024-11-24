const christmasConfig: ThemeDataConfig = {
  palette: {
    primary: [140, 20, 20],
    saturated: [200, 44, 44],
    pastel: [251, 212, 212],
    light: [253, 247, 247],
    page: [
      {
        type: "radial-gradient",
        sizeX: 90,
        sizeY: 100,
        posX: 50,
        posY: 100,
        stops: [
          {
            color: [255, 252, 252],
            opacity: 1,
            at: 0,
          },
          {
            color: [255, 247, 247],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: 90,
        sizeY: 90,
        posX: 50,
        posY: 50,
        stops: [
          {
            color: [255, 242, 242],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [255, 250, 250],
            opacity: 0,
            at: 100,
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: 30,
        stops: [
          {
            color: [255, 250, 250],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [255, 252, 252],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ff7075",
  favicon: {
    mode: "separate",
    outline: "#b61b20",
    gradient: [
      {
        stops: [
          {
            color: "#ffe8e8",
            offset: 0,
          },
          {
            color: "#ffcdcd",
            offset: 0.424,
          },
          {
            color: "#ffe2e2",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "christmas",
  misc: {
    readingBlur: 8,
  },
};

export default christmasConfig;
