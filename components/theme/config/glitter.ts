const glitterConfig: ThemeDataConfig = {
  palette: {
    primary: [249, 250, 251],
    saturated: [243, 244, 246],
    pastel: [107, 114, 128],
    light: [75, 85, 99],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [17, 24, 39],
            opacity: 1,
            at: 0,
          },
          {
            color: [31, 41, 55],
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
            color: [27, 36, 51],
            opacity: 0.55,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [37, 47, 61],
            opacity: 0.55,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#1f2937",
  favicon: {
    mode: "backdrop",
    outline: "#f3f4f6",
    backdropGradient: [
      {
        type: "radial-gradient",
        sizeX: 44.5,
        sizeY: 44.5,
        posX: 94.6,
        posY: 55.8,
        stops: [
          {
            at: 0,
            color: [142, 115, 79],
            opacity: 1.0,
          },
          {
            at: 100,
            color: [105, 100, 64],
            opacity: 0.0,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 54.9,
        sizeY: 54.9,
        posX: 0,
        posY: 59.5,
        stops: [
          {
            at: 0,
            color: [142, 79, 119],
            opacity: 1.0,
          },
          {
            at: 100,
            color: [105, 64, 98],
            opacity: 0.0,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 50.3,
        sizeY: 50.3,
        posX: 38.3,
        posY: 92.0,
        stops: [
          {
            at: 0,
            color: [79, 142, 98],
            opacity: 1.0,
          },
          {
            at: 100,
            color: [64, 105, 76],
            opacity: 0.0,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 64.0,
        sizeY: 64.0,
        posX: 31.7,
        posY: 14.4,
        stops: [
          {
            at: 0,
            color: [79, 131, 142],
            opacity: 1.0,
          },
          {
            at: 100,
            color: [64, 75, 105],
            opacity: 0.0,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 53.3,
        sizeY: 53.3,
        posX: 74.9,
        posY: 31.4,
        stops: [
          {
            at: 0,
            color: [79, 83, 142],
            opacity: 1.0,
          },
          {
            at: 100,
            color: [64, 69, 105],
            opacity: 0.0,
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          { at: 0, color: [17, 24, 39], opacity: 1 },
          { at: 100, color: [55, 65, 81], opacity: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "glitter",
};

export default glitterConfig;
