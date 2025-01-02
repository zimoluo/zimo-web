const memoriesConfig: ThemeDataConfig = {
  palette: {
    primary: [247, 244, 255],
    saturated: [200, 150, 247],
    pastel: [147, 91, 207],
    light: [105, 61, 168],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { color: [20, 18, 51], opacity: 1, at: 0 },
          { color: [15, 23, 42], opacity: 1, at: 100 },
        ],
        posX: 50,
        posY: -5,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        stops: [
          { color: [45, 37, 89], opacity: 0.7, at: 0 },
          { color: [51, 40, 97], opacity: 0.75, at: 100 },
        ],
        posX: 50,
        posY: 105,
        isCircle: true,
        sizeKeyword: "closest-corner",
      },
    ],
  },
  siteThemeColor: "#141233",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#4232a5", offset: 0 },
          { color: "#ae5ef3", offset: 0.8 },
          { color: "#a845ff", offset: 1 },
        ],
        angle: 90,
      },
    ],
  },
  animatedBackgroundKey: "memories",
};

export default memoriesConfig;
