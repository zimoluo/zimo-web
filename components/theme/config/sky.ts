const skyConfig: ThemeDataConfig = {
  palette: {
    primary: [13, 80, 102],
    saturated: [31, 122, 153],
    pastel: [116, 193, 219],
    light: [207, 243, 255],
    page: [
      {
        type: "radial-gradient",
        sizeX: 90,
        sizeY: 100,
        posX: 50,
        posY: 100,
        stops: [
          {
            color: [224, 246, 255],
            opacity: 1,
            at: 0,
          },
          {
            color: [163, 227, 255],
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
            color: [237, 250, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [224, 247, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#8adbff",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          {
            color: "#e0f6ff",
            offset: 0,
          },
          {
            color: "#a3e3ff",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "sky",
};

export default skyConfig;
