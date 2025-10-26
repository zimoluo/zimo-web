const vitreousConfig: ThemeDataConfig = {
  palette: {
    primary: [243, 242, 255],
    saturated: [175, 180, 255],
    pastel: [118, 116, 240],
    light: [102, 65, 235],
    page: [
      {
        type: "repeating-linear-gradient",
        stops: [
          { color: [0, 255, 255], opacity: 0.1804, at: 92 },
          { color: [7, 58, 255], opacity: 0, at: 100 },
        ],
        angle: 315,
      },
      {
        type: "repeating-radial-gradient",
        stops: [
          { color: [0, 255, 255], opacity: 0.0706, at: 30 },
          { color: [7, 58, 255], opacity: 0.0784, at: 39 },
        ],
        posX: 238,
        posY: 218,
        sizeX: 75,
        sizeY: 75,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [0, 201, 255], opacity: 1, at: 0 },
          { color: [7, 58, 255], opacity: 0, at: 100 },
        ],
        posX: 109,
        posY: 2,
        sizeX: 99,
        sizeY: 99,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [123, 0, 255], opacity: 1, at: 0 },
          { color: [7, 58, 255], opacity: 0, at: 100 },
        ],
        posX: 21,
        posY: 78,
        sizeX: 99,
        sizeY: 99,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [79, 53, 230], opacity: 1, at: 0 },
          { color: [38, 96, 255], opacity: 1, at: 100 },
        ],
        posX: 0,
        posY: 100,
        sizeX: 160,
        sizeY: 154,
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        stops: [
          { color: [79, 53, 230], opacity: 1, at: 15 },
          { color: [38, 96, 255], opacity: 1, at: 85 },
        ],
        angle: 45,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          {
            color: [117, 64, 255],
            opacity: 0.89,
            isWidgetOpacity: true,
            at: 12.5,
          },
          {
            color: [59, 83, 255],
            opacity: 0.97,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
        angle: 0,
      },
    ],
  },
  siteThemeColor: "#2660ff",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#883dff", offset: 0 },
          { color: "#3068ff", offset: 1 },
        ],
      },
    ],
  },
};

export default vitreousConfig;
