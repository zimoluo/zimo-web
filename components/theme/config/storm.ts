const stormConfig: ThemeDataConfig = {
  palette: {
    primary: [240, 238, 233],
    saturated: [222, 216, 200],
    pastel: [128, 115, 88],
    light: [92, 84, 64],
    page: [
      {
        type: "radial-gradient",
        sizeX: 90,
        sizeY: 100,
        posX: 50,
        posY: 100,
        stops: [
          {
            color: [130, 125, 111],
            opacity: 1,
            at: 0,
          },
          {
            color: [99, 94, 81],
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
        sizeY: 100,
        posX: 50,
        posY: 100,
        stops: [
          {
            color: [92, 84, 64],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [99, 91, 71],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#635e51",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          {
            color: "#b8b09c",
            offset: 0,
          },
          {
            color: "#575142",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "storm",
};

export default stormConfig;
