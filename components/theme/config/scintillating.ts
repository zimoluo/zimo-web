const scintillatingConfig: ThemeDataConfig = {
  palette: {
    primary: [120, 0, 50],
    saturated: [194, 0, 94],
    pastel: [255, 192, 218],
    light: [255, 231, 237],
    page: [
      {
        type: "repeating-linear-gradient",
        stops: [
          { color: [255, 175, 204], opacity: 0.18, at: 92 },
          { color: [255, 176, 193], opacity: 0, at: 100 },
        ],
        angle: 315,
      },
      {
        type: "repeating-radial-gradient",
        stops: [
          { color: [255, 210, 233], opacity: 0.0706, at: 30 },
          { color: [255, 116, 144], opacity: 0.0784, at: 39 },
        ],
        posX: 238,
        posY: 218,
        sizeX: 75,
        sizeY: 75,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 220, 238], opacity: 1, at: 0 },
          { color: [255, 171, 204], opacity: 0, at: 100 },
        ],
        posX: 109,
        posY: 2,
        sizeX: 99,
        sizeY: 99,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 224, 231], opacity: 1, at: 0 },
          { color: [255, 225, 240], opacity: 0, at: 100 },
        ],
        posX: 21,
        posY: 78,
        sizeX: 99,
        sizeY: 99,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 221, 233], opacity: 1, at: 0 },
          { color: [255, 227, 233], opacity: 1, at: 100 },
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
          { color: [255, 204, 216], opacity: 1, isWidgetOpacity: true, at: 0 },
          {
            color: [255, 232, 243],
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
          { offset: 0, color: "#ffe6f3" },
          { offset: 1, color: "#ff94b9" },
        ],
        angle: 45,
      },
    ],
  },
};

export default scintillatingConfig;
