const scintillatingConfig: ThemeDataConfig = {
  palette: {
    primary: [120, 0, 50],
    saturated: [194, 0, 94],
    pastel: [255, 152, 198],
    light: [255, 217, 228],
    page: [
      {
        type: "repeating-linear-gradient",
        stops: [
          { color: [255, 143, 184], opacity: 0.18, at: 92 },
          { color: [255, 131, 157], opacity: 0, at: 100 },
        ],
        angle: 315,
      },
      {
        type: "repeating-radial-gradient",
        stops: [
          { color: [255, 186, 221], opacity: 0.0706, at: 30 },
          { color: [255, 56, 96], opacity: 0.0784, at: 39 },
        ],
        posX: 238,
        posY: 218,
        sizeX: 75,
        sizeY: 75,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 212, 234], opacity: 1, at: 0 },
          { color: [255, 140, 186], opacity: 0, at: 100 },
        ],
        posX: 109,
        posY: 2,
        sizeX: 99,
        sizeY: 99,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 212, 221], opacity: 1, at: 0 },
          { color: [255, 222, 239], opacity: 0, at: 100 },
        ],
        posX: 21,
        posY: 78,
        sizeX: 99,
        sizeY: 99,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 212, 227], opacity: 1, at: 0 },
          { color: [255, 222, 229], opacity: 1, at: 100 },
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
          { color: [255, 201, 228], opacity: 1, at: 15 },
          { color: [255, 206, 224], opacity: 1, at: 85 },
        ],
        angle: 45,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [255, 199, 212], opacity: 1, isWidgetOpacity: true, at: 0 },
          {
            color: [255, 218, 236],
            opacity: 1,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
        angle: 0,
      },
    ],
  },
  siteThemeColor: "#ff92be",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { offset: 0, color: "#ffd1e9" },
          { offset: 0.8, color: "#ffa6c5" },
        ],
        angle: 90,
      },
    ],
  },
};

export default scintillatingConfig;
