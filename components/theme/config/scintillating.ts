const scintillatingConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 245, 237],
    saturated: [255, 212, 138],
    pastel: [255, 181, 52],
    light: [241, 126, 7],
    page: [
      {
        type: "repeating-linear-gradient",
        stops: [
          { color: [214, 173, 25], opacity: 0.18, at: 92 },
          { color: [224, 110, 16], opacity: 0, at: 100 },
        ],
        angle: 315,
      },
      {
        type: "repeating-radial-gradient",
        stops: [
          { color: [255, 218, 83], opacity: 0.0706, at: 30 },
          { color: [255, 119, 7], opacity: 0.0784, at: 39 },
        ],
        posX: 238,
        posY: 218,
        sizeX: 75,
        sizeY: 75,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [231, 176, 21], opacity: 1, at: 0 },
          { color: [255, 138, 8], opacity: 0, at: 100 },
        ],
        posX: 109,
        posY: 2,
        sizeX: 99,
        sizeY: 99,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [203, 79, 21], opacity: 1, at: 0 },
          { color: [255, 83, 8], opacity: 0, at: 100 },
        ],
        posX: 21,
        posY: 78,
        sizeX: 99,
        sizeY: 99,
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [211, 101, 42], opacity: 1, at: 0 },
          { color: [239, 157, 69], opacity: 1, at: 100 },
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
          { color: [211, 101, 42], opacity: 1, at: 15 },
          { color: [239, 157, 69], opacity: 1, at: 85 },
        ],
        angle: 45,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [241, 143, 14], opacity: 1, isWidgetOpacity: true, at: 15 },
          { color: [231, 152, 49], opacity: 1, isWidgetOpacity: true, at: 85 },
        ],
        angle: 90,
      },
    ],
  },
  siteThemeColor: "#ff8f17",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#e14b0b", offset: 0 },
          { color: "#ffc325", offset: 1 },
        ],
      },
    ],
  },
};

export default scintillatingConfig;
