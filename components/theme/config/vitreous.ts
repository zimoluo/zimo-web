const vitreousConfig: ThemeDataConfig = {
  palette: {
    primary: [243, 242, 255],
    saturated: [184, 198, 255],
    pastel: [95, 89, 255],
    light: [85, 66, 255],
    page: [
      {
        type: "repeating-linear-gradient",
        angle: 315,
        stops: [
          {
            color: [0, 255, 255],
            opacity: 0.1804,
            at: 92,
          },
          {
            color: [7, 58, 255],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "repeating-radial-gradient",
        sizeX: 75,
        sizeY: 75,
        posX: 238,
        posY: 218,
        stops: [
          {
            color: [0, 255, 255],
            opacity: 0.0706,
            at: 30,
          },
          {
            color: [7, 58, 255],
            opacity: 0.0784,
            at: 39,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 99,
        sizeY: 99,
        posX: 109,
        posY: 2,
        stops: [
          {
            color: [0, 201, 255],
            opacity: 1.0,
            at: 0,
          },
          {
            color: [7, 58, 255],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 99,
        sizeY: 99,
        posX: 21,
        posY: 78,
        stops: [
          {
            color: [123, 0, 255],
            opacity: 1.0,
            at: 0,
          },
          {
            color: [7, 58, 255],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 160,
        sizeY: 154,
        posX: 0,
        posY: 100,
        stops: [
          {
            color: [79, 53, 230],
            opacity: 1,
            at: 0,
          },
          {
            color: [38, 96, 255],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [79, 53, 230],
            opacity: 1,
            at: 15,
          },
          {
            color: [38, 96, 255],
            opacity: 1,
            at: 85,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [56, 109, 242],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 15,
          },
          {
            color: [59, 104, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 85,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#2660ff",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          {
            color: "#883dff",
            offset: 0,
          },
          {
            color: "#3068ff",
            offset: 1,
          },
        ],
      },
    ],
  },
};

export default vitreousConfig;
